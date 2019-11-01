import React, { Component } from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import WKWebView from '../react-native-wkwebview-reborn'
import PropTypes from 'prop-types'

export default class DWebBrowser extends Component {
    static propTypes = {
        style: PropTypes.any,
        uri: PropTypes.string.isRequired,
        network: PropTypes.string,
        infuraAPIKey: PropTypes.string.isRequired,
        addressHex: PropTypes.string.isRequired,
        onSignTransaction: PropTypes.func, // important
        onSignMessage: PropTypes.func,
        onSignPersonalMessage: PropTypes.func,
        onSignTypedMessage: PropTypes.func,
        onLoadEnd: PropTypes.func,
        onLoadStart: PropTypes.func,
        onProgress: PropTypes.func,
        onHistoryStateChange: PropTypes.func,
        onNavigationStateChange: PropTypes.func,
        jsContent: PropTypes.string.isRequired,
    }

    static defaultProps = {
        style: {},
        network: 'mainnet',
        onSignTransaction: (data) => { },
        onSignMessage: (data) => { },
        onSignPersonalMessage: (data) => { },
        onSignTypedMessage: (data) => { },
        onHistoryStateChange: (data) => { },
        onLoadEnd: () => { },
        onLoadStart: () => { },
        onProgress: () => { }
    }

    _onMessage(payload) {
        if (typeof payload === 'string') return
        const {
            onSignTransaction,
            onSignMessage = () => { },
            onSignPersonalMessage,
            onSignTypedMessage = () => { },
            onHistoryStateChange
        } = this.props
        switch (payload.data.name) {
            case 'signTransaction': {
                onSignTransaction({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signMessage': {
                onSignMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signPersonalMessage': {
                onSignPersonalMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'signTypedMessage': {
                onSignTypedMessage({ id: payload.data.id, object: payload.data.object })
                break
            }
            case 'history-state-changed': {
                onHistoryStateChange({ navState: payload.data.navState })
                break
            }
            default: break
        }
    }

    executeCallback(id, error, value) {
        const v = (typeof value === 'object') ? JSON.stringify(value) : `${value}`
        const e = error ? `'${error}'` : 'null'
        this.webview.evaluateJavaScript(`executeCallback(${id}, ${e}, '${v}')`)
    }

    reload() {
        this.webview.evaluateJavaScript(`location.reload();`)
    }

    goBack() {
        this.webview.evaluateJavaScript(`window.history.back();`)
    }

    goForward() {
        this.webview.evaluateJavaScript(`window.history.forward();`)
    }

    loadSource(url) {
        this.webview.evaluateJavaScript(`location.href = '${url}';`)
    }

    render() {
        const {
            style,
            uri,
            addressHex,
            network,
            infuraAPIKey = 'b174a1cc2f7441eb94ed9ea18c384730',
            onLoadEnd,
            onLoadStart,
            onProgress,
            onNavigationStateChange,
            jsContent
        } = this.props;
        return (
            <View style={[styles.container, style]}>
                <WKWebView
                    ref={(ref) => { this.webview = ref }}
                    source={{ uri }}
                    onMessage={(e) => { this._onMessage(e.nativeEvent) }}
                    injectJavaScript={getJavascript(addressHex, network, infuraAPIKey, jsContent)}
                    injectJavaScriptForMainFrameOnly={true}
                    mixedContentMode="compatibility"
                    javaScriptEnabled={true}
                    style={styles.webView}
                    onLoadEnd={onLoadEnd}
                    onLoadStart={onLoadStart}
                    onProgress={onProgress}
                    openNewWindowInWebView
                    onShouldStartLoadWithRequest={(e) => {
                        return e.url.startsWith('http')
                    }}
                    onNavigationStateChange={onNavigationStateChange}
                />
            </View>
        )
    }
}

const getJavascript = function (addressHex, network, infuraAPIKey, jsContent) {
    return `
         ${jsContent}
    var history = window.history;
    var pushState = history.pushState;
    history.pushState = function(state) {
        setTimeout(function () {
            window.webkit.messageHandlers.reactNative.postMessage({"name": "history-state-changed", "navState": {"url": location.href, "title": document.title}})
        }, 100);
        return pushState.apply(history, arguments);
    };

    function getChainID(name) {
      switch(name) {
        case 'mainnet': return 1;
        case 'ropsten': return 3;
        case 'rinkeby': return 4;
        case 'kovan': return 42;
      }

      throw new Error('Unsupport network')
    }

    function getInfuraRPCURL(chainID, apiKey) {
      switch(chainID) {
        case 1: return 'https://mainnet.infura.io/' + apiKey;
        case 3: return 'https://ropsten.infura.io/' + apiKey;
        case 4: return 'https://rinkeby.infura.io/' + apiKey;
        case 42: return 'https://kovan.infura.io/' + apiKey;
      }

      throw new Error('Unsupport network')
    }

    function getInfuraWSSURL(chainID, apiKey) {
      switch(chainID) {
        case 1: return 'wss://mainnet.infura.io/ws/' + apiKey;
        case 3: return 'wss://ropsten.infura.io/ws/' + apiKey;
        case 4: return 'wss://rinkeby.infura.io/ws/' + apiKey;
        case 42: return 'wss://kovan.infura.io/ws/' + apiKey;
      }

      throw new Error('Unsupport network')
    }

    let infuraAPIKey = '${infuraAPIKey}';
    let addressHex = '${addressHex}';
    let network = '${network}';
    let chainID = getChainID(network);
    let rpcUrl = getInfuraRPCURL(chainID, infuraAPIKey);
    let wssUrl = getInfuraWSSURL(chainID, infuraAPIKey);

    function executeCallback (id, error, value) {
      EzkeyProvider.executeCallback(id, error, value)
    }

    let EzkeyProvider = null

    function init() {
      EzkeyProvider = new Ezkey({
        noConflict: true,
        address: addressHex,
        networkVersion: chainID,
        rpcUrl,
        getAccounts: function (cb) {
          cb(null, [addressHex]) 
        },
        signTransaction: function (tx, cb){
          console.log('signing a transaction', tx)
          const { id = 8888 } = tx
          EzkeyProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signTransaction", "object": tx, id: id})
        },
        signMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signMessage", "object": { data }, id: id})
        },
        signPersonalMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a personal message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signPersonalMessage", "object": { data }, id: id})
        },
        signTypedMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a typed message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signTypedMessage", "object": { data }, id: id})
        }
      },
      {
        address: addressHex,
        networkVersion: chainID
      })
    }
    
    init();
    
    web3 = new Web3(EzkeyProvider)

    web3.eth.defaultAccount = addressHex
  
    web3.setProvider = function () {
      console.debug('Ezkey Wallet - overrode web3.setProvider')
    }

    web3.version.getNetwork = function(cb) {
      cb(null, chainID)
    }
    web3.eth.getCoinbase = function(cb) {
      return cb(null, addressHex)
    }
  `
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webView: {
        flex: 1
    }
})
