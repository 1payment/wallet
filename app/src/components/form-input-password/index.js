import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Easing, Alert } from 'react-native';
import Header from '../../components/header';
import Color from '../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../helpers/constant/responsive'
import { Fumi } from '../../components/text-input-effect'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Encrypt_password } from '../../../services/index.account'
import { getStorage } from '../../../helpers/storages';
import Settings from '../../../settings/initApp'
import TouchID from 'react-native-touch-id';
import BackgroundApp from '../background'
import Button from '../button'

class FormPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txt_password: '',
            disable_button: true,
            god_eye: true,
        };
    }
    // static navigationOptions = {
    //     gesturesEnabled: false,
    // }

    componentDidMount() {
        this.use_fingerprint()
    }

    use_fingerprint = () => {
        const { isAuth } = this.props.navigation.getParam('payload')
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
                            this.props.navigation.goBack();
                            isAuth();

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
        const { isAuth } = this.props.navigation.getParam('payload')
        Encrypt_password(this.state.txt_password).then(pwd => {
            getStorage('password').then(pwd_storage => {
                // console.log('sdsd', pwd, pwd_storage)
                if (pwd == pwd_storage) {
                    this.props.navigation.goBack();
                    isAuth(pwd_storage);
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

    change_god_eye = () => {
        this.setState({ god_eye: !this.state.god_eye })
    }

    render() {
        const Auth = this.props.navigation.getParam('payload')

        return (
            <Modal
                animationType="slide"
            >
                <BackgroundApp>
                    <Header
                        IconLeft={Auth.canBack ? "arrow-back" : undefined}
                        onPressLeft={() => Auth.canBack ? this.props.navigation.goBack() : null}
                        Title="Password"
                        styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                        colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                        colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                    />
                    <View style={styles.container}>
                        <View style={{
                            paddingVertical: hp('1'),
                            borderLeftWidth: 4,
                            borderLeftColor: Settings.mode_secure ? '#fff' : Color.Tomato,
                            paddingHorizontal: wp('5')
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: font_size(4), color: Settings.mode_secure ? "#fff" : Color.Tomato }}>Enter password</Text>
                            <Text style={{ fontSize: font_size(3), color: Settings.mode_secure ? "#fff" : Color.Tomato }}>to {Auth.canBack ? 'process' : 'sign to wallet'}</Text>
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
                                style={{ flex: 8.5, borderRadius: 10 }}
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

                        <View style={styles.formChangePasscode}>

                            <Button
                                onpress={this.checkPassword.bind(this)}
                                disable={this.state.disable_button}
                                title="Enter"
                            />
                        </View>{
                            Settings.ez_turn_on_fingerprint &&
                            <View style={styles.formChangePasscode}>
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
        borderRadius: 10,
        marginTop: hp('3'),
        flexDirection: 'row'
    }
})

const styles = StyleSheet.create({
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
export default FormPassword;
