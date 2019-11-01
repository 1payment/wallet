
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing, Alert } from 'react-native'
import { Fumi } from '../../../components/text-input-effect';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Encrypt_password } from '../../../../services/index.account'
import { getStorage } from '../../../../helpers/storages';
import TouchID from 'react-native-touch-id';
import Settings from '../../../../settings/initApp'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Color from '../../../../helpers/constant/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/header';
import { signMessageDapps, signTransaction } from '../dapp.service'
import { utils } from 'ethers';
import BackgroundApp from '../../../components/background'
import Button from '../../../components/button'


interface PropsConfirm {
    openModal: Function,
    closeModal: Function
}

export default class FormPassword extends Component<PropsConfirm>{
    constructor(props) {
        super(props);
        this.state = {
            txt_password: '',
            disable_button: true,
            god_eye: true,
            eyeAnim: new Animated.Value(0),
            visibleModal: false
        };
    }

    openModal = (param) => {
        this.setState({ visibleModal: true })
        this.param = param;
    }

    componentDidMount() {
        if (this.state.visibleModal) {
            this.use_fingerprint()
        }
    }

    use_fingerprint = () => {
        if (Settings.ez_turn_on_fingerprint) {
            let optionalConfig = {
                unifiedErrors: false,
                passcodeFallback: true
            }
            TouchID.isSupported(optionalConfig).then(isSupporter => {
                console.log('supported', isSupporter)
                if (isSupporter) {
                    let options = {
                        title: "Ez Pay", // Android
                        sensorDescription: 'Touch sensor', // Android
                        sensorErrorDescription: 'Failed', // Android
                        cancelText: 'Cancel', // Android
                        fallbackLabel: "", // iOS (if empty, then label is hidden)
                    }
                    TouchID.authenticate('Scan ' + isSupporter + ' to process').then((auth, error) => {
                        if (error) {
                            console.log('errrrr', error)
                            Alert.alert(
                                'Error',
                                error,
                                [{ text: 'Ok', style: 'default' }]
                            )
                        } else {
                            console.log('Touch id', auth)
                            this.setState({ visibleModal: false }, () => {
                                this.actionConfirm()
                            })
                        }
                    }).catch(err => {
                        console.log('err', err)
                    })
                } else {
                    Alert.alert(
                        'Error',
                        'Your device not support ' + isSupporter,
                        [{ text: 'Ok', style: 'default' }]
                    )
                }
            })
        }
    }


    change_txt_password = async (value) => {
        this.setState({ txt_password: value })
        if (value.length < 5) {
            await this.setState({ disable_button: true })
        } else {
            await this.setState({ disable_button: false })
        }
    }

    checkPassword = () => {
        Encrypt_password(this.state.txt_password).then(pwd => {
            getStorage('password').then(pwd_storage => {
                if (pwd == pwd_storage) {
                    this.setState({ visibleModal: false }, () => {
                        this.actionConfirm()
                    })
                } else {
                    Alert.alert(
                        'Error',
                        'Invalid password',
                        [{ text: 'Ok', style: 'default' }]
                    )
                }
            })
        })
    }

    actionConfirm = () => {
        const { type, gasPrice } = this.props;
        if (type == 'sign_message') {
            console.log('yes', this.param)
            signMessageDapps(utils.toUtf8String(this.param.object.data), this.state.txt_password, this.param.pk_en)
                .then(tx => {
                    console.log('tx', tx)
                    this.param.callBack(this.param.id, tx);
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
        } else {
            signTransaction(
                this.state.txt_password,
                gasPrice,
                this.param.pk_en,
                this.param.object,
            ).then((tx) => {
                console.log(tx)
                this.param.callBack(this.param.id, tx);
                this.props.navigation.goBack()
            }).catch(e => {
                Alert.alert(
                    'Error',
                    e,
                    [{
                        text: 'Ok', style: 'default', onPress: () => this.props.navigation.goBack()
                    }]
                )
            })
        }
    }

    change_god_eye = () => {
        this.setState({ god_eye: !this.state.god_eye })
    }

    render() {
        const { canBack } = this.props

        return (
            <Modal
                animationType="slide"
                visible={this.state.visibleModal}
            >
                <BackgroundApp>
                    <Header
                        IconLeft={"arrow-back"}
                        onPressLeft={() => this.setState({ visibleModal: false })}
                        Title="Password"
                        styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                        colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                        colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                    />
                    <View style={styles2.container}>
                        <View style={{ paddingVertical: hp('1'), borderLeftWidth: 4, paddingHorizontal: wp('5') }}>
                            <Text style={{ fontWeight: 'bold', fontSize: font_size(4) }}>Enter password</Text>
                            <Text style={{ fontSize: font_size(3) }}>to process</Text>
                        </View>
                        <View style={stylePassword.formInput}>
                            <Fumi
                                ref={(r) => { this.name = r; }}
                                label={'Password'}
                                iconClass={FontAwesomeIcon}
                                iconName={'lock'}
                                iconColor={'#f95a25'}
                                iconSize={25}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_password(value) }}
                                value={this.state.txt_password}
                                onSubmitEditing={() => this.checkPassword()}
                                returnKeyType="done"
                                numberOfLines={1}
                                secureTextEntry={this.state.god_eye ? true : false}
                                autoFocus={true}
                                style={{ flex: 8.5 }}
                            />
                            <TouchableOpacity
                                style={{
                                    flex: 1.5,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => this.change_god_eye()}
                            >
                                <Icon name={this.state.god_eye ? 'eye' : 'eye-off'} size={25} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles2.formChangePasscode}>
                            <Button
                                title="Enter"
                                onpress={this.checkPassword}
                                disable={this.state.disable_button}
                            />
                        </View>{
                            Settings.ez_turn_on_fingerprint &&
                            <View style={styles2.formChangePasscode}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                                    onPress={() => this.use_fingerprint()}
                                >
                                    <View style={{ justifyContent: 'center' }}>
                                        <Icon name="fingerprint" size={20} style={{ marginHorizontal: wp('2') }} color={Color.Tomato} />
                                    </View>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text> User fingerprint</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </BackgroundApp>
            </Modal>

        );
    }
}
const stylePassword = StyleSheet.create({
    formInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: hp('3'),
        flexDirection: 'row'
    }
})

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1'),
    },
    formChangePasscode: {
        paddingHorizontal: wp('20'),
        paddingVertical: hp('3')
    },
    styleButton: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1.3%'),
        borderRadius: hp('1.3'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})