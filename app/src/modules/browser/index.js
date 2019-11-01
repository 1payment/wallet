import React, { Component } from 'react'
import { Text, View, WebView, StatusBar, TouchableOpacity, Linking, Modal, ActivityIndicator } from 'react-native'
import Gradient from 'react-native-linear-gradient';
import Header from '../../components/header'
import Icon from 'react-native-vector-icons/FontAwesome'
import Color from '../../../helpers/constant/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../helpers/constant/responsive'
import BackgroundApp from '../../components/background'
import Settings from '../../../settings/initApp'

export default class Browser extends Component {
    state = {
        loading: true
    }

    _onNavigationStateChange(webViewState) {
        console.log(webViewState)
        if (webViewState.loading) {
            this.setState({ loading: true })
        } else {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 1000);
        }
    }

    render() {
        const url = this.props.navigation.getParam('url')
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title=""
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: url }}
                        style={{ width: wp('100%') }}
                        ref={r => this.webview = r}
                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    />
                    <View
                        style={{
                            height: hp('7%'),
                            width: wp('100'),
                            backgroundColor: '#328FFC',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.webview.goBack()
                            }}
                            style={{ flex: 1 }}
                        >
                            <Icon name="chevron-left"
                                style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                                size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.webview.goForward() }}
                            style={{ flex: 1 }}
                        >
                            <Icon name="chevron-right"
                                style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}
                                size={25} />
                        </TouchableOpacity>
                        <View style={{ flex: 8 }} />
                    </View>
                    {
                        this.state.loading ?
                            <Modal
                                animationType='fade'
                                transparent={true}
                                visible={true}>
                                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.2)' }}>
                                    <ActivityIndicator size='large' color="#30C7D3" style={{ flex: 1 }} />
                                </View>
                            </Modal>
                            : null
                    }
                </View>
            </BackgroundApp>
        )
    }
}