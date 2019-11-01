import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Header from '../../../components/header';
import { Fumi } from '../../../components/text-input-effect'
import { getStorage, setStorage } from '../../../../helpers/storages';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView, KeyboardAwareListView } from '../../../components/Keyboard-Aware-Scroll'
import Settings from '../../../../settings/initApp'
import { Encrypt_password, Encrypt } from '../../../../services/index.account'
import BackgroundApp from '../../../components/background';
import Button from '../../../components/button'

export default class PasswordSecure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type_password: 'create',
            pwd_old: '',
            txt_password_old: '',
            txt_password: '',
            err_password: false,
            txt_confirm_password: '',
            err_confirm_password: false,
            disable_button: true,
            txt_password_old: '',
            err_password_old: false
        };
        getStorage('password').then(pwd => {
            if (pwd) {
                this.setState({ type_password: 'update', pwd_old: pwd })
            } else {
                this.setState({ type_password: 'create', pwd_old: '' })
            }
        })
        this.type_add = this.props.navigation.getParam('payload').type_add
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.change_txt_password_old('123456');
    //         this.change_txt_password('123456');
    //         this.change_txt_confirm_password('123456');
    //         setTimeout(() => {
    //             this.Func_button_update_password()
    //         }, 500);
    //     }, 500);
    // }

    change_txt_password_old = (value) => {
        this.setState({ txt_password_old: value })
    }

    change_txt_password = async (value) => {
        this.setState({ txt_password: value })
        if (value.length > 5) {
            await this.setState({ err_password: false, disable_button: true })
        } else {
            await this.setState({ err_password: true, disable_button: false })
        }

        if (this.state.txt_confirm_password == '' || this.state.txt_confirm_password == value) {
            await this.setState({ err_confirm_password: false })
        } else {
            await this.setState({ err_confirm_password: true })
        }
        if (this.state.txt_password == '' || this.state.txt_confirm_password == '' || this.state.err_password == true || this.state.err_confirm_password == true) {
            await this.setState({ disable_button: true })
        } else {
            await this.setState({ disable_button: false })
        }
    }

    change_txt_confirm_password = (value) => {
        this.setState({ txt_confirm_password: value })
        if (this.state.txt_password && this.state.txt_password == value) {
            this.setState({ err_confirm_password: false, disable_button: false })
        } else {
            this.setState({ err_confirm_password: true, disable_button: true })
        }
    }

    Func_button_create_password = () => {
        Encrypt_password(this.state.txt_password).then(pwd_en => {
            this.props.navigation.navigate('SelectToken', {
                payload: {
                    type_add: this.type_add,
                    pwd_en
                }
            })
        }).catch(e => console.log(e))
    }

    Func_button_update_password = () => {
        Encrypt_password(this.state.txt_password_old).then(async pwd_old => {
            console.log(pwd_old, this.state.pwd_old)
            if (pwd_old == this.state.pwd_old) {
                this.props.navigation.navigate('SelectToken', {
                    payload: {
                        type_add: this.type_add,
                        pwd_en: pwd_old
                    }
                })
            } else {
                Alert.alert(
                    'Error',
                    'Incorrect old password',
                    [{ text: 'Ok', style: 'default' }]
                )
            }
        })
    }

    render() {
        return (
            <BackgroundApp in_app={false}>
                <Header
                    IconLeft={"arrow-back"}
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Password"
                    styleTitle={{ color: "#fff" }}
                    colorIconLeft='#fff'
                    colorIconRight="#fff"
                />
                <View style={styles.container}>
                    {/* <ScrollView keyboardShouldPersistTaps='handled'> */}
                    <KeyboardAwareScrollView>
                        {
                            this.state.type_password == 'update' &&
                            <View style={stylePassword.formInput}>
                                <Fumi
                                    ref={(r) => { this.name = r; }}
                                    label={'Password old'}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'lock'}
                                    iconColor={'#f95a25'}
                                    iconSize={25}
                                    iconWidth={40}
                                    inputPadding={16}
                                    onChangeText={(value) => { this.change_txt_password_old(value) }}
                                    value={this.state.txt_password_old}
                                    onSubmitEditing={() => { this.password.focus() }}
                                    returnKeyType="next"
                                    numberOfLines={1}
                                    secureTextEntry={true}
                                    style={{ borderRadius: 5 }}
                                />
                            </View>
                        }

                        <View style={stylePassword.formInput}>
                            <Fumi
                                ref={(r) => { this.password = r; }}
                                label={this.state.type_password != 'update' ? 'Password' : 'Password new'}
                                iconClass={FontAwesomeIcon}
                                iconName={'lock'}
                                iconColor={'#f95a25'}
                                iconSize={25}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_password(value) }}
                                value={this.state.txt_password}
                                onSubmitEditing={() => { this.confirmpwd.focus() }}
                                returnKeyType="next"
                                numberOfLines={1}
                                secureTextEntry={true}
                                style={{ borderRadius: 5 }}

                            />
                        </View>
                        {
                            this.state.err_password &&
                            <Text style={{ color: Color.Danger }}>Password needs at least 6 characters</Text>
                        }

                        <View style={stylePassword.formInput}>
                            <Fumi
                                ref={(r) => { this.confirmpwd = r; }}
                                label={this.state.type_password != 'update' ? 'Confirm password' : 'Confirm password new'}
                                iconClass={FontAwesomeIcon}
                                iconName={'lock'}
                                iconColor={'#f95a25'}
                                iconSize={25}
                                iconWidth={40}
                                inputPadding={16}
                                onChangeText={(value) => { this.change_txt_confirm_password(value) }}
                                value={this.state.txt_confirm_password}
                                onSubmitEditing={() => this.state.type_password != 'update' ? this.Func_button_create_password() : this.Func_button_update_password()}
                                returnKeyType="done"
                                numberOfLines={1}
                                secureTextEntry={true}
                                style={{ borderRadius: 5 }}
                            />
                        </View>
                        {
                            this.state.err_confirm_password &&
                            <Text style={{ color: Color.Danger }}>Password do not match</Text>
                        }

                        <View style={styles.formChangePasscode}>
                            <Button
                                onpress={this.state.type_password != 'update' ? this.Func_button_create_password : this.Func_button_update_password}
                                disable={this.state.disable_button}
                                title={this.state.type_password != 'update' ? 'Create password' : 'Update password'}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    {/* </ScrollView> */}
                </View>
            </BackgroundApp>
        );
    }
}

const stylePassword = StyleSheet.create({
    formInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: hp('3')
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2'),
    },
    styleButton: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1.3%'),
        borderRadius: hp('1.3'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formChangePasscode: {
        padding: wp('15'),
    },
})
