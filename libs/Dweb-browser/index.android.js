import React, { Component } from 'react'
import {
    StyleSheet,
    // WebView,
    Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import WebView from 'react-native-webview-bridge-updated/webview-bridge'

const { width, height } = Dimensions.get('window')
export default class WebBrowser extends Component {
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
        jsContent: PropTypes.string.isRequired,
        onLoadEnd: PropTypes.func,
        onLoadStart: PropTypes.func,
        onProgress: PropTypes.func
    }

    static defaultProps = {
        style: {},
        network: 'mainnet',
        onSignTransaction: (data) => { },
        onSignMessage: (data) => { },
        onSignPersonalMessage: (data) => { },
        onSignTypedMessage: (data) => { },
        onLoadEnd: () => { },
        onLoadStart: () => { },
        onProgress: () => { }
    }


    componentDidMount() {

    }

    _onBridgeMessage(resTX) {
        // console.warn(resTX)
        let payload = {}
        try {
            payload = JSON.parse(resTX)
        } catch (error) {
            console.warn(error)
        }
        if (typeof payload !== 'object') return
        const {
            onSignTransaction,
            onSignMessage = () => { },
            onSignPersonalMessage,
            onSignTypedMessage = () => { }
        } = this.props
        switch (payload.name) {
            case 'signTransaction': {
                onSignTransaction({ id: payload.id, object: payload.tx })
                break
            }
            case 'signMessage': {
                onSignMessage({ id: payload.id, object: payload.tx })
                break
            }
            case 'signPersonalMessage': {
                onSignPersonalMessage({ id: payload.id, object: { data: payload.data } })
                break
            }
            case 'signTypedMessage': {
                onSignTypedMessage({ id: payload.id, object: payload.tx })
                break
            }
            default: break
        }
    }

    executeCallback(id, error, value) {
        const v = (typeof value === 'object') ? JSON.stringify(value) : `${value}`
        const e = error ? `'${error}'` : 'null'
        this.webview.sendToBridge(`executeCallback(${id}, ${e}, '${v}')`)
    }

    goBack() {
        this.webview.goBack()
    }

    goForward() {
        this.webview.goForward()
    }

    reload() {
        this.webview.reload()
    }

    loadSource(url) {
        this.webview.loadSource(url)
    }

    render() {
        const {
            uri,
            addressHex,
            network,
            infuraAPIKey,
            jsContent,
            onLoadEnd,
            onLoadStart
        } = this.props

        return (
            <WebView
                ref={(ref) => { this.webview = ref }}
                onBridgeMessage={this._onBridgeMessage.bind(this)}
                // mixedContentMode="compatibility"
                javaScriptEnabled={true}
                // injectedJavaScript={getJavascript(addressHex, network, infuraAPIKey, jsContent, uri)}
                // onLoadStart={() => this.webview.injectJavaScript(getJavascript(addressHex, network, infuraAPIKey, jsContent))}
                injectedOnStartLoadingJavaScript={getJavascript(addressHex, network, infuraAPIKey, jsContent)}
                source={uri}
                onLoadEnd={onLoadEnd}
                onLoadStart={onLoadStart}
                onProgress
            />
        )
    }
}

const getJavascript = function (addressHex, network, infuraAPIKey, jsContent) {
    // return `window.test = () => alert('AAA')`
    return `
    ${jsContent}
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
      console.log(JSON.stringify(value))
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
          const resTx = {name: 'signTransaction', id, tx} 
          WebViewBridge.send(JSON.stringify(resTx))
        },
        signMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          console.log("signMessage")
          const resTx = {name: "signMessage", id, tx} 
          WebViewBridge.send(JSON.stringify(resTx))
        },
        signPersonalMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a personal message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          console.log("signPersonalMessage")
          const resTx = {name: "signPersonalMessage", id, data} 
          WebViewBridge.send(JSON.stringify(resTx))
        },
        signTypedMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a typed message", msgParams)
          EzkeyProvider.addCallback(id, cb)
          console.log("signTypedMessage")
          const resTx = {name: "signTypedMessage", id, tx} 
          WebViewBridge.send(JSON.stringify(resTx))
        }
      },
      {
        address: addressHex,
        networkVersion: chainID
      })
    }
    
    init();
    window.web3 = new Web3(EzkeyProvider)
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
        width,
        height
    },
    webView: {
        position: 'absolute',
        width,
        height
    }
})