import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Dimensions,
    Clipboard,
    Alert,
} from 'react-native'
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import ButtonBottom from '../../../components/buttonBottom';
import { Sae } from '../../../components/text-input-effect';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from '../../../components/Keyboard-Aware-Scroll';
import { CheckIsAddress, Check_fee_with_balance, Send_Token, Update_balance, DecryptWithPassword } from '../../../../services/index.account';
import { convertWeiToEther } from '../../../../services/ETH/account.service'
import RBSheet from '../../../../lib/bottom-sheet';
import { get_balance_wallet, insert_favorite, get_all_favorite, name_favorite } from '../../../../db';
import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BackgroundApp from '../../../components/background'
import Settings from '../../../../settings/initApp'
import Button from '../../../components/button'

const TransactionFee = [
    {
        title: 'Slow',
        fee: 0.00008,
        gasPrice: 4
    },
    {
        title: 'Average',
        fee: 0.00021,
        gasPrice: 10
    },
    {
        title: 'Fast',
        fee: 0.00042,
        gasPrice: 20
    }
]


class SendScreen extends Component {

    componentDidMount() {
        console.log('payload', this.props.navigation.getParam('payload'))
    }
    render() {
        const data = this.props.navigation.getParam('payload');
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Send"
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}

                />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flex: 1, paddingHorizontal: wp('3%') }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FormSend data={data} {...this.props} />
                    </ScrollView>
                </View>
            </BackgroundApp>
        )
    }
}

const styleButton = (type) => StyleSheet.create({
    button: {
        flex: 3.3,
        // paddingHorizontal: 5,
        borderRadius: 20,
        backgroundColor: type ? Color.Vanilla_Ice : Color.Whisper,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 3,
        paddingHorizontal: 3
    },
    text: {
        color: type ? Color.Tomato : Color.Dark_gray,
        fontSize: font_size(1.5)
    }
})


const styles = StyleSheet.create({
    FormAddress: {
        flex: 3,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: hp('2%'),
        padding: hp('1%'),
        flexDirection: 'column'
    },
    FormAmount: {
        flex: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: hp('1%'),
        flexDirection: 'column'
    }
})


const { height, width } = Dimensions.get('window')
let heightKeyboard = 0;
let locationInput = 0
class FormSend extends Component {

    constructor(props) {
        super(props)

        this.state = {
            ...this.init_state,
            price_usd: this.props.data.price,
            paddingScroll: 0,
            selectFee: 'Average',
            gasPrice: this.props.data.network == 'ethereum' ? 10 : 0,
            checkbox: true,
            list_Favorite: [],
            gasFee: 0,
            gas: 0,
            disable_all: false,
            gasLimit: 21000,
        }
        console.log(this.props.data)
    }

    init_state = {
        txt_Address: '',
        err_Txt_Address: false,
        txt_Amount: '',
        err_Txt_Amount: false,
        txt_Desc: '',
        disable_btn_send: true
    }

    async componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            heightKeyboard = e.endCoordinates.height;
            if (locationInput + 50 > height - heightKeyboard) {
                this.setState({ paddingScroll: 50 })
            } else {
                this.setState({ paddingScroll: 0 })
            }
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ paddingScroll: 0 })
        });

        get_all_favorite().then(data => {
            this.setState({ list_Favorite: data })
        })
        var temp = this.state.gasPrice / 1000000000
        var fee = temp * this.state.gasLimit;

        this.setState({ gasFee: fee })
        const data = this.props.data;
        if (data.type && data.type == 'qrscan') {
            try {
                var value = await convertWeiToEther(data.value);
            } catch (error) {
                console.log('error', error)
            }
            console.log('aaa', value)
            this.change_txt_address(data.toAddress);
            this.change_txt_amount(value);
            this.change_txt_desc(data.description);
            this.setState({ gas: data.gas, disable_all: true })
        }
    }

    setGasFee = (gasFee, gasPrice, gasLimit) => {
        this.setState({ gasFee, gasPrice, gasLimit })
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    onSelect = async data => {
        if (data['result'] == 'cancelScan') return;
        var data_qr = await data['result'];
        try {
            data_qr = await JSON.parse(data_qr);
            await this.change_txt_address(data_qr.to);
            await this.change_txt_amount(data_qr.value);
            if (data_qr.description != '') {
                await Alert.alert(
                    'Message',
                    data_qr.description,
                    [{ text: 'Ok', style: 'cancel' }]
                )
            }
        } catch (error) {
            this.change_txt_address(data_qr)
        }
    }

    navigateToScan() {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect });
    }

    SelectFee = (title, fee, gasPrice) => {
        const { item, addressTK, network, decimals } = this.props.data
        this.setState({ selectFee: title })
        Check_fee_with_balance(fee, item.address, addressTK, network, decimals).then(ss => {
            if (!ss) {
                Alert.alert(
                    'Error',
                    'Insufficient balance.',
                    [{ text: 'Ok', style: 'cancel' }]
                )
            } else {
                this.setState({ gasPrice: gasPrice, gasFee: fee })
            }
        }).catch(e => console.log(e))
    }

    change_txt_address = async (value) => {
        const { network } = this.props.data;
        CheckIsAddress(value, network).then(async status => {
            if (status) {
                await this.setState({ txt_Address: value, err_Txt_Address: false })
            } else {
                await this.setState({ txt_Address: value, err_Txt_Address: true })
            }
        })
        await this.enable_Button_Send()
    }

    enable_Button_Send = () => {
        if (
            this.state.err_Txt_Address == true ||
            this.state.err_Txt_Amount == true ||
            this.state.txt_Address.length < 1 ||
            parseFloat(this.state.txt_Amount) <= 0 ||
            this.state.txt_Amount.length < 1
        ) {
            this.setState({ disable_btn_send: true })
        } else {
            this.setState({ disable_btn_send: false })
        }
    }

    setMaxBalance = () => {
        const data = this.props.data
        get_balance_wallet(data.item.id).then(balance => {
            this.change_txt_amount(balance)
        })
    }

    Func_button_send = () => {
        if (this.props.SETTINGS.ez_turn_on_fingerprint || this.props.SETTINGS.ez_turn_on_passcode) {
            this.props.navigation.navigate('FormPassword', {
                payload: {
                    canBack: true,
                    isAuth: this.SendToken
                }
            })
        } else {
            this.SendToken()
        }
    }

    SendToken = async (pwd?= "") => {
        const { item, addressTK, network, decimals } = this.props.data;
        var privateKey
        if (this.props.SETTINGS.mode_secure) {
            privateKey = await DecryptWithPassword(item.private_key, pwd)
        } else {
            privateKey = item.private_key
        }
        Send_Token(
            item.address,
            this.state.txt_Address,
            this.state.txt_Amount,
            addressTK,
            privateKey,
            network,
            decimals,
            this.state.gasPrice,
            parseFloat(this.state.gas)
        )
            .then(async TransactionHash => {
                console.log(TransactionHash)
                if (this.state.checkbox) {
                    var favorite_object = {
                        id: Math.floor(Date.now() / 1000),
                        name: `Favorite ${await name_favorite() + 1}`,
                        address: this.state.txt_Address
                    }
                    await insert_favorite(favorite_object).then(ss2 => {
                        console.log(ss2)
                    }).catch(err => console.log(err))
                }
                await Alert.alert(
                    'Send success',
                    TransactionHash,
                    [
                        { text: 'Ok', style: 'cancel' },
                        { text: 'Copy', onPress: () => { Clipboard.setString(TransactionHash) }, style: 'cancel' }
                    ]
                )
                await this.setState(this.init_state);
            }).catch(e => {
                Alert.alert(
                    'Error',
                    e,
                    [{ text: 'Ok', style: 'cancel' }]
                )
            })
    }

    change_txt_desc = (value) => {
        this.setState({ txt_Desc: value })
    }

    change_txt_amount = async (value) => {
        const data = this.props.data;
        if (value > 0) {
            get_balance_wallet(data.item.id).then(async balance => {
                if (parseFloat(value) + this.state.gasFee <= parseFloat(balance)) {
                    await this.setState({
                        price_usd: parseFloat(value) * parseFloat(data.price),
                        txt_Amount: value,
                        err_Txt_Amount: false
                    }, () => {
                        this.enable_Button_Send()
                    })
                } else {
                    await this.setState({
                        price_usd: parseFloat(value) * parseFloat(data.price),
                        txt_Amount: value,
                        err_Txt_Amount: true
                    }, () => {
                        this.enable_Button_Send()
                    })
                }
            }).catch(console.log)
        } else {
            await this.setState({
                price_usd: data.price,
                txt_Amount: value,
                err_Txt_Amount: false
            }, () => {
                this.enable_Button_Send()
            })
        }
    }

    clear_txt_address = () => {
        this.change_txt_address('')
    }

    paste_txt_address = async () => {
        let val = await Clipboard.getString()
        await this.change_txt_address(val)
    }


    onTouch_Input = async (evt) => {
        locationInput = await evt.nativeEvent.pageY;
        if (heightKeyboard > 0) {
            if (locationInput + 50 > height - heightKeyboard) {
                this.setState({ paddingScroll: 50 })
            } else {
                this.setState({ paddingScroll: -50 })
            }
        }
    }

    chooseAddress = (address) => {
        this.RBSheet.close()
        this.change_txt_address(address)
    }

    focusTheField = (id) => {
        this.inputs[id].focus();
    }
    inputs = {};

    render() {
        const data = this.props.data;
        let symbolFee;
        switch (data.network) {
            case 'ethereum':
                symbolFee = 'ETH';
                break;
            case 'nexty':
                symbolFee = 'NTY';
                break;
            default:
                symbolFee = 'TRX';
                break;
        }
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
                behavior={'position'}
                enabled={this.state.paddingScroll > 0 ? true : false}
            // keyboardVerticalOffset={this.state.paddingScroll}
            // ref={(r)=>this.Avoiding = r}
            >
                <View style={styles.FormAddress}>
                    <View style={{
                        flex: 4.5,
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: this.state.err_Txt_Address ? Color.Scarlet : Color.SILVER
                    }}>
                        <View style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}>
                            <Sae
                                ref={(r) => { this.address = r; }}
                                label={'Enter Address'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: this.state.disable_all ? Color.Dark_gray : Color.Tomato, paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_address(value) }}
                                showBorderBottom={false}
                                style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}
                                value={this.state.txt_Address}
                                onTouchStart={e => this.onTouch_Input(e)}
                                onSubmitEditing={() => { this.amount.focus() }}
                                returnKeyType="next"
                                numberOfLines={1}
                                editable={!this.state.disable_all}
                            />

                        </View>
                        <View style={{ flex: this.state.txt_Address.length > 0 ? 1 : 2, justifyContent: 'center', alignItems: 'center', paddingTop: hp('3%') }}>
                            {
                                this.state.txt_Address.length > 0 ?
                                    <TouchableOpacity
                                        onPress={() => this.clear_txt_address()}
                                        disabled={this.state.disable_all}
                                    >
                                        <Icon name="close-circle-outline" size={font_size(3)} color={Color.Scarlet} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => this.paste_txt_address()}
                                    >
                                        <Text style={{ color: Color.Tomato }}>Paste</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                    </View>

                    <View style={{ flex: 2.5, flexDirection: 'row', paddingVertical: hp('1%') }}>
                        <TouchableOpacity
                            onPress={() => this.RBSheet.open()}
                            style={{
                                backgroundColor: Color.Whisper,
                                flex: 5,
                                paddingVertical: hp('1%'),
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                borderRadius: 20,
                                marginHorizontal: wp('2%'),
                                flexDirection: 'row',
                            }}
                            disabled={this.state.disable_all}
                        >
                            <View>
                                <Text style={{ color: Color.Dark_gray, fontSize: font_size(1.8) }}>Favorite</Text>
                            </View>
                            <View>
                                <Icon name="account-box-outline" size={font_size(2.5)} />
                            </View>
                        </TouchableOpacity >
                        <TouchableOpacity
                            onPress={() => this.navigateToScan()}
                            style={{
                                backgroundColor: Color.Whisper,
                                flex: 5,
                                paddingVertical: 7,
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                borderRadius: 20,
                                marginHorizontal: wp('2%'),
                                flexDirection: 'row'
                            }}
                            disabled={this.state.disable_all}
                        >
                            <View>
                                <Text style={{ color: Color.Dark_gray, fontSize: font_size(1.8) }}>Scan QR</Text>
                            </View>
                            <View>
                                <Icon name="qrcode-scan" size={font_size(2.5)} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Add contact to <Text style={{ fontWeight: 'bold' }}>favorite</Text></Text>
                        <CheckBox checked={this.state.checkbox} color={Color.Malachite} onPress={() => this.setState({ checkbox: !this.state.checkbox })} />
                    </View>
                </View>
                <View style={styles.FormAmount}>
                    {/************* Start input Amount *************/}
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <View style={{
                            borderBottomWidth: 1,
                            flexDirection: 'row',
                            borderBottomColor: this.state.err_Txt_Amount ? Color.Scarlet : Color.SILVER
                        }}>
                            <Sae
                                ref={(r) => { this.amount = r; }}
                                label={data.symbol}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                // labelHeight={20}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: this.state.disable_all ? Color.Dark_gray : Color.Tomato, borderBottomWidth: 0, fontSize: font_size(3.5), paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_amount(value) }}
                                value={this.state.txt_Amount.toString()}
                                style={{ flex: 9 }}
                                keyboardType="numeric"
                                showBorderBottom={false}
                                onResponderEnd={e => this.onTouch_Input(e)}
                                editable={!this.state.disable_all}
                            />
                            <TouchableOpacity
                                onPress={this.setMaxBalance}
                                disabled={this.state.disable_all}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                }}>
                                <Text style={{ color: Color.Tomato }}>Max</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 9, fontSize: font_size(1.5) }}>~{this.state.price_usd}</Text>
                            <Text style={{ flex: 1, fontSize: font_size(1.5) }}>USD</Text>
                        </View>
                    </View>

                    {/************* End input Amount *************/}


                    {/************* Start input Description *************/}
                    <View style={{ flex: 3, }}>
                        <View style={{ borderBottomWidth: 1, flexDirection: 'row' }}>
                            <Sae
                                ref={(r) => { this.note = r; }}
                                label={'Description'}
                                iconClass={Icon}
                                iconName={'pencil'}
                                iconColor={Color.Whisper}
                                labelStyle={{ color: Color.Whisper }}
                                inputStyle={{ color: this.state.disable_all ? Color.Dark_gray : Color.Tomato, paddingBottom: 0, }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(value) => { this.change_txt_desc(value) }}
                                style={{ flex: 9 }}
                                showBorderBottom={false}
                                onResponderEnd={e => this.onTouch_Input(e)}
                                value={this.state.txt_Desc}
                                editable={!this.state.disable_all}
                            />
                        </View>
                    </View>
                    {/************* Start input Description *************/}

                    <View style={{ flex: 3 }}>
                        <Text style={{ textAlign: 'left', }}>Transaction Fee</Text>
                        <View style={{ flexDirection: 'row', paddingVertical: hp('2') }}>
                            <View style={{ flex: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: font_size(2.5) }}>{this.state.gasFee.toFixed(5)} {data.symbol}</Text>
                            </View>
                            <TouchableHighlight
                                style={[styleButton(true).button, { flex: 5, paddingVertical: hp('1') }]}
                                underlayColor={Color.Tomato}
                                onPress={() => this.props.navigation.navigate('CustomFee', {
                                    payload: {
                                        gasLimit: this.state.gasLimit,
                                        gasPrice: this.state.gasPrice,
                                        callBack: this.setGasFee,
                                        symbolFee: data.symbol,
                                        network: data.network,
                                        address: data.item.address,
                                        addressTK: data.addressTK,
                                        decimals: data.decimals
                                    }
                                })}
                                disabled={this.state.disable_all}
                            >
                                <Text>Advance</Text>
                            </TouchableHighlight>
                            {/* {
                                TransactionFee.map((item, index) => {
                                    let symbolFee;
                                    let itemFee;
                                    let itemGasPrice;
                                    switch (data.network) {
                                        case 'ethereum':
                                            symbolFee = 'ETH';
                                            itemFee = item.fee;
                                            itemGasPrice = item.gasPrice;
                                            break;
                                        case 'nexty':
                                            symbolFee = 'NTY';
                                            itemFee = 0;
                                            itemGasPrice = 0
                                            break;
                                        default:
                                            symbolFee = 'TRX';
                                            itemFee = 0;
                                            itemGasPrice = 0;
                                            break;
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={index.toString()}
                                            style={[styleButton(this.state.selectFee === item.title).button]}
                                            onPress={() => this.SelectFee(item.title, itemFee, itemGasPrice)}
                                            disabled={this.state.disable_all}
                                        >
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.title}</Text>
                                            <Text style={[styleButton(this.state.selectFee === item.title).text]}>{itemFee + ' ' + symbolFee}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            } */}
                        </View>
                    </View>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', paddingHorizontal: wp('20%') }}>
                    {/* <TouchableOpacity
                        onPress={() => this.Func_button_send()}
                        disabled={this.state.disable_btn_send}
                    >
                        <Gradient
                            colors={this.state.disable_btn_send ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingHorizontal: wp('3%'),
                                paddingVertical: hp('1.5%'),
                                borderRadius: 7,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
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
                        onpress={this.Func_button_send}
                        disable={this.state.disable_btn_send}
                        title="Next"
                    />
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    height={hp('70')}
                    duration={250}
                    customStyles={{
                        container: {
                            // justifyContent: "center",
                            // alignItems: "center",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            backgroundColor: Color.Tomato
                        }
                    }}>

                    <View
                        style={{
                            padding: hp('1'),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableHighlight
                            onPress={() => this.RBSheet.close()}
                            underlayColor="transparent"
                        >
                            <View style={{
                                height: hp('0.7%'),
                                width: wp('10%'),
                                backgroundColor: '#fff',
                                borderRadius: 5
                            }} />
                        </TouchableHighlight>

                    </View>

                    <View style={{
                        paddingHorizontal: 5,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        flex: 1
                    }}>
                        <View style={{ padding: 5 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold' }}>List favorite</Text>
                            </View>
                        </View>
                        {
                            this.state.list_Favorite.length > 0 ?
                                <FlatList
                                    data={this.state.list_Favorite}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: Color.Light_gray
                                                }}
                                                onPress={() => this.chooseAddress(item.address)}
                                            >
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text numberOfLines={1} ellipsizeMode="middle" style={{ color: Color.Dark_gray }}>{item.address}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="select" size={font_size(25)} />
                                </View>
                        }

                    </View>
                </RBSheet>
            </KeyboardAvoidingView >
        )
    }
}


mapStateToProps = state => {
    return {
        SETTINGS: state.Settings
    }
}

export default connect(mapStateToProps, null)(SendScreen)