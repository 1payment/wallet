import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    StatusBar,
    Clipboard,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    Modal,
    TouchableHighlight,
    Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../../helpers/constant/color';
import { Create_account_secure } from '../../../../services/index.account'
import { InitData } from '../../../../db';
import { getStorage, setStorage } from '../../../../helpers/storages';
import { GetListToken, Func_Settings } from '../../../../redux/rootActions/easyMode';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Setting from '../../../../settings/initApp';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Gradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { isValidMnemonic } from './add-token.service'
import ListToken from '../../../../helpers/constant/listToken';
import ImageApp from '../../../../helpers/constant/image';
import Button from '../../../components/button'


class Import extends Component {
    state = {
        textInput: '',
        enable_button: false,
        error: '',
        enable_button: false,
        showModal: false,
    }



    ChangeText = (val) => {
        this.setState({ textInput: val }, async () => {
            if (await isValidMnemonic(val)) {
                this.setState({ enable_button: true, error: '' });
            } else {
                this.setState({ enable_button: false, error: 'Invalid recovery phrase' })
            }
            // if (Platform.OS == 'android') {
            //     this.setState({ enable_button: true, error: '' });
            // }
        })
    }

    goToDashboard = () => {
        this.setState({ showModal: true })
        setTimeout(() => {
            const { item, pwd_en } = this.props.navigation.getParam('payload');
            Create_account_secure(this.state.textInput, 0, item.network, pwd_en).then(wallet => {
                this.setState({ showModal: false })
                console.log(wallet.node, wallet.seed);
                var ID = Math.floor(Date.now() / 1000);
                const InitData_Object = {
                    id: ID,
                    mode: 'Secure',
                    seeds: wallet.seed,
                    token: [{
                        id: ID,
                        name: item.name,
                        symbol: item.symbol,
                        network: item.network,
                        address: item.address,
                        price: 0.0,
                        percent_change: 0.0,
                        icon: '',
                        decimals: item.decimals,
                        total_balance: 0,
                        id_market: item.id_market,
                        account: [{
                            id: ID,
                            name: 'Account 1',
                            token_type: item.network,
                            address: wallet.node.address,
                            private_key: wallet.node.privateKey,
                            balance: 0,
                            time: new Date()
                        }]
                    }]
                }

                console.log(InitData_Object)
                InitData(InitData_Object)
                    .then(() => {
                        Setting.first_open = true;
                        setStorage('list_token', JSON.stringify(ListToken)).then(() => {
                            Setting.push_list_token = true;
                            Setting.ez_turn_on_passcode = true;
                            Setting.ez_turn_on_fingerprint = false;
                            setStorage('setting', JSON.stringify(Setting)).then(() => {
                                this.props.Func_Settings(Setting)
                                setStorage('password', pwd_en).then(ss => {
                                    this.props.GetListToken();
                                    this.props.navigation.navigate('InApp');
                                    StatusBar.setBarStyle('light-content', true)
                                })
                            })
                        })
                    })
                    .catch(e => console.log('ssss', e))
            }).catch(err => {
                this.setState({ showModal: false }, () => {
                    setTimeout(() => {
                        Alert.alert(
                            'Error',
                            err,
                            [{ text: 'Ok', style: 'cancel' }]
                        )
                    }, 350);
                })

            })
        }, 350);
    }

    clear_text_input = () => {
        this.setState({ textInput: '' })
    }

    Paste_input = async () => {
        let val = await Clipboard.getString()
        await this.ChangeText(val)
    }

    onSelect = (data) => {
        if (data['result'] !== 'cancelScan') {
            console.log(data)
            var result = data['result']
            this.ChangeText(result)
        }
    }

    selectFile = () => {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            if (res != null) {
                // Android
                console.log(
                    res.uri,
                    '\n- ' + res.type, // mime type
                    '\n- ' + res.fileName,
                    '\n- ' + res.fileSize
                );
                RNFS.readFile(res.uri).then(data => {
                    console.log(data)
                    this.ChangeText(data)
                }).catch(err => {
                    console.log(err)
                })
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ backgroundColor: '#fff', borderRadius: 5, padding: 10, paddingVertical: 20, flexDirection: 'row' }}>
                        <TextInput
                            style={{ color: Color.DARKBLUE, flex: 8 }}
                            numberOfLines={5}
                            multiline={true}
                            onChangeText={(val) => this.ChangeText(val)}
                            value={this.state.textInput}
                            underlineColorAndroid="transparent"
                        />
                        {
                            this.state.textInput.length > 0 ?
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onPress={() => this.clear_text_input()}
                                >
                                    <Icon name="close-circle" size={25} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    onPress={() => this.Paste_input()}
                                    style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Text style={{ color: Color.DARKBLUE }}>Paste</Text>
                                </TouchableOpacity>
                        }

                    </View>
                    {
                        this.state.enable_button == false && this.state.error != '' &&
                        <Text style={{ color: '#fff' }}>{this.state.error}</Text>
                    }
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ flex: 5 }}
                            onPress={() => this.props.navigation.navigate('QRScan', { onSelect: this.onSelect })}
                        >
                            <Gradient
                                colors={Color.Gradient_clear_sky}
                                style={styles.styleButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                    <Text style={{ color: '#fff', }}>Scan QR code</Text>
                                </View>
                                <Icon name="qrcode-scan" size={20} style={{ color: '#fff', textAlign: 'center' }} />
                            </Gradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 5 }}
                            onPress={() => this.selectFile()}
                        >
                            <Gradient
                                colors={Color.Gradient_master_card}
                                style={styles.styleButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={{ justifyContent: 'center', marginRight: 5 }}>
                                    <Text style={{ color: '#fff' }}>Select file</Text>
                                </View>
                                <Icon name="folder-key" size={20} style={{ color: '#fff', textAlign: 'center' }} />
                            </Gradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formButton}>
                        {/* <TouchableOpacity
                            onPress={this.goToDashboard}
                            disabled={!this.state.enable_button}
                        >
                            <Gradient
                                colors={this.state.enable_button ? Color.Gradient_button_tomato : Color.Gradient_gray_switch}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.styleButtonNext}
                            >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Next</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                                </View>
                            </Gradient>
                        </TouchableOpacity> */}
                        <Button
                            onpress={this.goToDashboard.bind(this)}
                            disable={!this.state.enable_button}
                        />
                    </View>

                </ScrollView>
                <ModalLoading showModal={this.state.showModal} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1'),
    },
    styleButton: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    styleButtonNext: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1.3%'),
        borderRadius: hp('1.3'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formButton: {
        padding: wp('20'),
    }
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ GetListToken, Func_Settings }, dispatch)
}

export default connect(null, mapDispatchToProps)(Import);

class ModalLoading extends Component {
    render() {
        return (
            <Modal
                visible={this.props.showModal}
                animationType="fade"
                transparent
            >
                <TouchableHighlight
                    onPress={() => { this.setState({ visibleModal: false }) }}
                    style={{
                        flex: 1,
                        paddingVertical: hp('30'),
                        paddingHorizontal: wp('10'),
                        backgroundColor: 'rgba(0, 0, 0, 0.57)',
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={ImageApp.ic_encrypt} style={{ height: wp('30'), width: wp('30') }} resizeMode="contain" />
                        <Text style={{ fontSize: font_size(4), fontWeight: 'bold', textAlign: 'center' }}>Encrypting data...</Text>
                        <Text style={{ fontSize: font_size(4), fontWeight: 'bold', textAlign: 'center' }}>Please wait!</Text>
                    </View>
                </TouchableHighlight>
            </Modal>
        )

    }
}