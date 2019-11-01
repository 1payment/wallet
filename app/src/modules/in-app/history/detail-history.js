import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Linking,
    StyleSheet,
    Text,
    Platform,
    Clipboard,
    ToastAndroid,
    Vibration,
    VibrationIOS,
    StatusBar
} from 'react-native';

import {
    ListItem,
    Body,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Header from '../../../components/header';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import FlashMessage, { showMessage } from '../../../../lib/flash-message'
import URI from '../../../../helpers/constant/uri';
import Settings from '../../../../settings/initApp'
import BackgroundApp from '../../../components/background'
import Button from '../../../components/button'

export default class DetailHis extends Component {
    copy = (value) => {
        Clipboard.setString(value)
        Vibration.vibrate(100)
        showMessage({
            message: 'Copy success',
            type: 'success',
            animated: true,
            icon: "success",
        });
    }

    _goExplorer() {
        const { data, network } = this.props.navigation.getParam('payload')
        const { navigate } = this.props.navigation;
        navigate('Browser', { url: URI.EXPLORER_WEB(network, Settings.testnet) + data.tx });
    }

    render() {
        const { data, network } = this.props.navigation.getParam('payload')

        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="History"
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <FlashMessage position="top" />
                <View style={{ flex: 1, padding: hp('2') }}>
                    <View style={{
                        paddingHorizontal: wp('4%'),
                        paddingVertical: hp('3%'),
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.34,
                        shadowRadius: 2.27,
                        elevation: 5,
                        borderRadius: 10,
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center'
                    }} >
                        <Text style={{
                            fontSize: hp('4%'),
                            fontWeight: '400',
                            color: '#444444',
                            marginBottom: hp('5%'),
                            textAlign: 'center'
                        }}>Transaction details</Text>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }} onPress={() => { this.copy(data.tx) }} >
                            <Body>
                                <Text style={styleText} >Txhash</Text>
                                <Text style={styleText} note numberOfLines={1} ellipsizeMode="middle" >{data.tx}</Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0, marginLeft: 0 }} onPress={() => { data.type == "arrow-up" ? this.copy(data.data.to) : this.copy(data.data.from) }}>
                            <Body>
                                <Text style={styleText}>{data.type == "arrow-up" ? 'To' : 'From'}</Text>
                                <Text
                                    style={styleText}
                                    note
                                    numberOfLines={1}
                                    ellipsizeMode="middle"
                                >
                                    {data.type == "arrow-up" ? data.data.to : data.data.from}
                                </Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>Amount</Text>
                                {
                                    Platform.OS == "ios" ?
                                        <Text style={styleText} note numberOfLines={1}>{
                                            parseFloat(data.quantity) % 1 == 0
                                                ? parseFloat(data.quantity).toLocaleString()
                                                : parseFloat(data.quantity).toFixed(2).toLocaleString()
                                        }</Text>
                                        :
                                        <Text style={styleText} note numberOfLines={1}>{
                                            parseFloat(data.quantity) % 1 == 0
                                                ? (parseFloat(data.quantity).toLocaleString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : (parseFloat(data.quantity).toFixed(2).toLocaleString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }</Text>
                                }
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>Time</Text>
                                <Text note numberOfLines={1} style={styleText}>{data.datetime}</Text>
                            </Body>
                        </ListItem>

                        <ListItem icon style={{ marginTop: 5, marginBottom: 5, marginLeft: 0 }}>
                            <Body>
                                <Text style={styleText}>Status</Text>
                                <Text style={{ color: "green" }} note numberOfLines={1} >COMPLETE</Text>
                            </Body>
                        </ListItem>
                        <View style={{ marginVertical: hp('4%'), paddingHorizontal: wp('15%') }}>
                            <Button
                                title="Explorer"
                                onpress={this._goExplorer.bind(this)}
                            />

                        </View>
                    </View>
                </View>
            </BackgroundApp>
        )
    }
}
const styleText = {
}
const styles = StyleSheet.create({
    TextButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp('4%'),
    },
    button: {
        justifyContent: 'center',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
    },
})