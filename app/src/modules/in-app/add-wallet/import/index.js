import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    Image,
    TextInput,
    ScrollView,
    Clipboard,
    Alert
} from 'react-native'
import ImageApp from '../../../../../helpers/constant/image';
import Color from '../../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Header from '../../../../components/header';
import CONSTANT from '../../../../../helpers/constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Func_import_account, isValidMnemonic, getAllAccount } from './import.service';
import ButtonBottom from '../../../../components/buttonBottom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Func_Add_Account } from '../actions'
import { StackActions, NavigationActions } from 'react-navigation';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Import_account_of_token } from '../../token/actions';
import SETTINGS from '../../../../../settings/initApp';
import { getStorage } from '../../../../../helpers/storages';
import { EncryptWithPassword } from "../../../../../services/index.account";
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../../helpers/constant/responsive';
import BackgroundApp from '../../../../components/background'


class Import extends Component {
    state = {
        textInput: '',
        disableButton: true,
        error: '',
        listAccount: []
    }
    ObjToken = {}

    componentWillMount() {
        const { type } = this.props.navigation.getParam('payload')
        if (type == 'account') {
            var tempArray = [];
            getAllAccount().then(listAccount => {
                console.log(listAccount)
                listAccount.forEach((item, index) => {
                    console.log(item, index);
                    if (tempArray.length == 0) {
                        tempArray.push(item);
                    } else {
                        var TempIndex = tempArray.findIndex(x => x.address == item.address);
                        console.log(TempIndex)
                        if (TempIndex == -1) {
                            tempArray.push(item);
                        }
                    }
                    if (index == listAccount.length - 1) {
                        this.setState({ listAccount: tempArray })
                    }
                });
            })
        }
    }

    ChangeText = async (val) => {

        const { token, type } = this.props.navigation.getParam('payload')
        await this.setState({ textInput: val })

        switch (type) {
            case 'privatekey':
                const regex = /[a-zA-Z0-9]{60,}/;
                var OK = regex.test(val);
                console.log(OK, regex.exec(val))
                if (!OK) {
                    this.setState({ disableButton: true, error: 'Invalid private key' })
                    break;
                }
                this.import_by_privatekey(val, type, token)
                break;
            case 'mnemoric':
                var isValid = await isValidMnemonic(val);
                if (isValid) {
                    this.import_by_mnemonic(val, type, token);
                    break
                } else {
                    this.setState({ disableButton: true, error: 'Invalid Phrase' })
                    break
                }
            default:
                break;
        }
    }

    import_by_privatekey = (val, type, token) => {
        console.log('aaaa')
        Func_import_account(val, type, token.network).then(address => {
            this.setState({ disableButton: false, error: '' });
            var ID = Math.floor(Date.now() / 1000);
            if (SETTINGS.mode_secure) {
                getStorage('password').then(async pwd => {
                    this.ObjToken = {
                        id: ID,
                        name: token.name,
                        symbol: token.symbol,
                        network: token.network,
                        address: token.address,
                        price: 0,
                        percent_change: 0,
                        icon: '',
                        decimals: token.decimals,
                        total_balance: 0,
                        id_market: token.id_market,
                        account: [{
                            id: ID,
                            name: 'Account 1',
                            token_type: token.network,
                            address: address,
                            private_key: await EncryptWithPassword(val, pwd),
                            balance: 0,
                            time: new Date()
                        }]
                    }
                })
            } else {
                this.ObjToken = {
                    id: ID,
                    name: token.name,
                    symbol: token.symbol,
                    network: token.network,
                    address: token.address,
                    price: 0,
                    percent_change: 0,
                    icon: '',
                    decimals: token.decimals,
                    total_balance: 0,
                    id_market: token.id_market,
                    account: [{
                        id: ID,
                        name: 'Account 1',
                        token_type: token.network,
                        address: address,
                        private_key: val,
                        balance: 0,
                        time: new Date()
                    }]
                }
            }

        }).catch(e => {
            console.log('error', e)
            this.setState({ disableButton: true, error: e })
        })
    }

    import_by_mnemonic = (val, type, token) => {
        Func_import_account(val, type, token.network).then(account => {
            this.setState({ disableButton: false, error: '' });
            var ID = Math.floor(Date.now() / 1000);

            if (SETTINGS.mode_secure) {
                getStorage('password').then(async pwd => {
                    this.ObjToken = {
                        id: ID,
                        name: token.name,
                        symbol: token.symbol,
                        network: token.network,
                        address: token.address,
                        price: 0,
                        percent_change: 0,
                        icon: '',
                        decimals: token.decimals,
                        total_balance: 0,
                        id_market: token.id_market,
                        account: [{
                            id: ID,
                            name: 'Account 1',
                            token_type: token.network,
                            address: account.address,
                            private_key: await EncryptWithPassword(account.privateKey, pwd),
                            balance: 0,
                            time: new Date()
                        }]
                    }
                })
            } else {
                this.ObjToken = {
                    id: ID,
                    name: token.name,
                    symbol: token.symbol,
                    network: token.network,
                    address: token.address,
                    price: 0,
                    percent_change: 0,
                    icon: '',
                    decimals: token.decimals,
                    total_balance: 0,
                    id_market: token.id_market,
                    account: [{
                        id: ID,
                        name: 'Account 1',
                        token_type: token.network,
                        address: account.address,
                        private_key: account.privateKey,
                        balance: 0,
                        time: new Date()
                    }]
                }
            }
        }).catch(e => {
            console.log(e)
        })
    }

    onSelect = data => {
        if (data['result'] !== 'cancelScan') {
            console.log(data)
            var result = data['result']
            this.ChangeText(result)
        }
    }

    clear_text_input = () => {
        this.setState({ textInput: '' })
    }

    Paste_input = async () => {
        let val = await Clipboard.getString()
        await this.ChangeText(val)
    }

    ImportAccount = async () => {
        const { typeAdd, token } = this.props.navigation.getParam('payload');
        if (typeAdd == 'token') {
            await this.props.Func_Add_Account(this.ObjToken);
            await this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Dashboard',
                    }),
                ],
            }))
        } else {
            const { loadData } = this.props.navigation.getParam('payload')
            await Import_account_of_token(token.id, this.ObjToken.account[0]).then(ss => {
                if (ss) {
                    loadData();
                    this.props.navigation.pop(2)
                }
            }).catch(e => {
                console.log('sss', e);
            })
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

                if ((res.fileName).substring((res.fileName).lastIndexOf('.') + 1, (res.fileName).length) == 'txt') {
                    RNFS.readFile(res.uri).then(data => {
                        console.log(data)
                        this.ChangeText(data)
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    Alert.alert(
                        'Warning',
                        'Please select a valid backup file',
                        [{ text: 'Ok', onPress: () => { }, style: 'cancel' }]
                    )
                }

            }
        });
    }

    Import_exist_account = (privateKey, type, token) => {
        this.import_by_privatekey(privateKey, type, token)
        setTimeout(() => {
            this.ImportAccount()
        }, 350);
    }

    _render_listItem = ({ item, index }) => {
        const { token } = this.props.navigation.getParam('payload');
        console.log(item)
        switch (item.token_type) {
            case 'ethereum':

                break;
            case 'nexty':

                break;
            default:
                break;
        }
        return (
            <TouchableOpacity
                style={styles.stylesItem}
                onPress={() => this.Import_exist_account(item.private_key, 'privatekey', token)}
            >
                <Text style={styles.NameSelect}>{item.name}</Text>
                <Text style={styles.AddressSelect}>{item.token_type}</Text>
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.AddressSelect}>{item.address}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { token, type } = this.props.navigation.getParam('payload')
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title={type}
                    styleTitle={{ color: SETTINGS.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={SETTINGS.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={SETTINGS.mode_secure ? '#fff' : Color.Tomato}

                />
                <View style={styles.container}>
                    {
                        type == 'account' ?
                            <ScrollView>
                                {
                                    this.state.listAccount.length > 0 &&
                                    <FlatList
                                        data={this.state.listAccount}
                                        keyExtractor={(index, item) => item.toString()}
                                        renderItem={this._render_listItem}
                                    />
                                }

                            </ScrollView>
                            :
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
                                    this.state.disableButton == true && this.state.error != '' &&
                                    <Text style={{ color: 'red' }}>{this.state.error}</Text>
                                }
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{ flex: 5 }}
                                        onPress={() => this.props.navigation.navigate('QRscan', { onSelect: this.onSelect })}
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

                            </ScrollView>
                    }
                    {
                        type !== 'account' &&
                        <ButtonBottom
                            text="Import"
                            onPress={this.ImportAccount}
                            disable={this.state.disableButton}
                        />
                    }

                </View>
            </BackgroundApp>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    styleButton: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        marginHorizontal: 5
    },
    stylesItem: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: hp('1'),
        padding: wp('3')
    },
    NameSelect: {
        fontWeight: 'bold',
        marginBottom: hp('1')
    },
    AddressSelect: {

    }
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Add_Account }, dispatch)
}
export default connect(null, mapDispatchToProps)(Import)