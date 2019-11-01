import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, Alert } from 'react-native';
import Color from '../../../../helpers/constant/color';
import Header from '../../../components/header';
import { utils } from 'ethers';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Settings from '../../../../settings/initApp'
import { signMessageDapps } from '../dapp.service'
import FormPassword from './confirm-password'
import BackgroundApp from '../../../components/background';
import Button from '../../../components/button'


export default class signMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            passcode: ''
        }
        this.params = this.props.navigation.state.params
    }

    onSignPersonalMessage = () => {
        if (Settings.ez_turn_on_passcode) {
            this.modalConfirm.openModal(this.params)
        } else {
            this.handleSign()
        }
    }

    handleSign() {
        const { params } = this.props.navigation.state;
        console.log('sss', this.props)
        signMessageDapps(utils.toUtf8String(params.object.data), this.state.passcode, params.pk_en)
            .then(tx => {
                console.log('tx', tx)
                params.callBack(params.id, tx);
                this.props.navigation.goBack()
            }).catch(e => {
                setTimeout(() => {
                    Alert.alert(
                        'Error',
                        e,
                        [{ text: 'Ok', style: 'cancel' }]
                    )
                }, 350)
            })
    }

    render() {
        const { params } = this.props.navigation.state
        const info = utils.toUtf8String(params.object.data)
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title='Sign message'
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <View style={[styles.container, { flexDirection: 'column' }]}>
                    <View style={{ flex: 7 }}>
                        <Text style={[styles.standardText, { marginTop: 15, alignSelf: 'center', fontStyle: 'italic' }]}>
                            Only authorize signature from sources that
                        </Text>
                        <Text style={[styles.standardText, { alignSelf: 'center', fontStyle: 'italic' }]}>
                            you trust.
                        </Text>
                        <View style={styles.formMessage}>
                            <View style={[styles.item]}>
                                <Text style={styles.key}>Requester</Text>
                                <Text style={[styles.standardText, { marginTop: 10 }]}>{params.url}</Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.item]}>
                                <Text style={styles.key}>Message</Text>
                                <Text style={[styles.standardText, { marginTop: 10 }]}>{info}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: wp('20%') }}>
                        <Button
                            title="Sign"
                            onpress={this.onSignPersonalMessage.bind(this)}
                            disable={false}
                        />
                    </View>
                    <FormPassword
                        ref={r => this.modalConfirm = r}
                        isAuth={this.handleSign}
                        canBack={true}
                        type='sign_message'
                        {...this.props}
                        gasPrice={0}
                    />
                </View>
            </BackgroundApp>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2'),
    },
    standardText: {
        fontSize: font_size(1.8),
        color: Color.Dark_gray
    },
    item: {
        paddingVertical: hp('1'),
        paddingHorizontal: wp('2')
    },
    line: {
        height: 1,
        backgroundColor: Color.Dark_gray,
        marginHorizontal: wp('2'),
    },
    key: {
        fontSize: font_size(2.3),
        marginTop: 15,
        fontWeight: 'bold',
    },
    buttonSign: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formMessage: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: hp('3'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.27,
        elevation: 7,
    }
})

