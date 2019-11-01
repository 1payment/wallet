import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Clipboard,
    FlatList,
} from 'react-native'
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Sae } from '../../../components/text-input-effect';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import { convertWeiToEther } from '../../../../services/ETH/account.service';
import { Check_fee_with_balance, } from '../../../../services/index.account';
import Button from '../../../components/button'
import BackgroundApp from '../../../components/background'
import Settings from '../../../../settings/initApp'


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

export default class CustomFee extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gasLimit: 0,
            gasPrice: 0,
            fee: 0,
            warning: '',
            disableButton: true,
            selectFee: '',
            disable_select_fee: false
        }
    }

    componentWillMount() {
        this.ParamNav = this.props.navigation.getParam('payload')
        this.change_txt_gasLimit(this.ParamNav.gasLimit, true);
        this.change_txt_gasPrice(this.ParamNav.gasPrice, true);
        this.setState({ selectFee: this.ParamNav.gasPrice })
    }

    clear_txt_gasLimit = () => {

    }

    change_txt_gasLimit = (value, type) => {
        if (type) {
            this.setState({ gasLimit: value }, () => {
                if (21000 <= value) {
                    this.Transaction_fee()
                } else {
                    this.setState({ warning: 'Gas Price Extremely Low', disableButton: true })
                }
            });
        } else {
            this.setState({ gasLimit: value, disable_select_fee: true }, () => {
                if (21000 <= value) {
                    this.Transaction_fee()
                } else {
                    this.setState({ warning: 'Gas Price Extremely Low', disableButton: true })
                }
            });

        }

    }



    change_txt_gasPrice = (value, type) => {
        if (type) {
            this.setState({ gasPrice: value }, () => {
                if (0 < value) {
                    this.Transaction_fee()
                } else {
                    this.setState({ warning: 'Gas Price Extremely Low', disableButton: true })
                }
            });
        } else {
            this.setState({ gasPrice: value, disable_select_fee: true }, () => {
                if (0 < value) {
                    this.Transaction_fee()
                } else {
                    this.setState({ warning: 'Gas Price Extremely Low', disableButton: true })
                }
            });
        }
    }

    Transaction_fee = async () => {
        var temp = this.state.gasPrice / 1000000000
        var fee = temp * this.state.gasLimit;
        this.setState({ fee, disableButton: false, warning: '' });
        if (! await Check_fee_with_balance(fee, this.ParamNav.address, this.ParamNav.addressTK, this.ParamNav.network, this.ParamNav.decimals)) {
            this.setState({ disableButton: true, warning: 'Insufficient balance.' })
        }
    }


    clear_txt_gasPrice = () => {

    }

    Func_button_Fee = () => {
        this.props.navigation.getParam('payload').callBack(this.state.fee, this.state.gasPrice, this.state.gasLimit);
        this.props.navigation.goBack();
    }

    SelectFee = (title, fee, gasPrice) => {
        this.setState({ selectFee: gasPrice });
        this.change_txt_gasPrice(gasPrice, true)
    }

    _render_item_flatlist = (item, index) => {
        const data = this.props.navigation.getParam('payload')
        return (
            <TouchableOpacity
                key={index.toString()}
                style={[styleButton(this.state.selectFee === item.gasPrice && !this.state.disable_select_fee).button]}
                onPress={() => this.SelectFee(item.title, item.fee, item.gasPrice)}
                disabled={this.state.disable_select_fee}
            >
                <Text style={[styleButton(this.state.selectFee === item.gasPrice && !this.state.disable_select_fee).text]}>{item.title}</Text>
                <Text style={[styleButton(this.state.selectFee === item.gasPrice && !this.state.disable_select_fee).text]}>{item.fee + ' ' + data.symbolFee}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Advance fee"
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <View style={styles.container}>
                    <View style={{ paddingVertical: hp('3'), flexDirection: 'row' }}>
                        {
                            TransactionFee.map(this._render_item_flatlist)
                        }
                    </View>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formInput}>
                            <View style={styles.rowInput}>
                                <View style={{ flex: 9 }}>
                                    <Sae
                                        ref={(r) => { this.gasLimit = r; }}
                                        label={'Gas limit'}
                                        iconClass={Icon}
                                        iconName={'pencil'}
                                        iconColor={Color.Whisper}
                                        labelStyle={{ color: Color.SILVER }}
                                        inputStyle={{ color: Color.Tomato, paddingBottom: 0, }}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        onChangeText={this.change_txt_gasLimit}
                                        showBorderBottom={false}
                                        // style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}
                                        value={this.state.gasLimit.toString()}
                                        onSubmitEditing={() => { this.gasPrice.focus() }}
                                        returnKeyType="next"
                                        numberOfLines={1}
                                        keyboardType="numeric"

                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: hp('3%') }}>
                                    {
                                        this.state.gasLimit.length > 0 &&
                                        <TouchableOpacity
                                            onPress={() => this.clear_txt_gasLimit()}
                                        >
                                            <Icon name="close-circle-outline" size={font_size(3)} color={Color.Scarlet} />
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>
                            <View style={[styles.rowInput, { marginBottom: hp('1') }]}>
                                <View style={{ flex: 9 }}>
                                    <Sae
                                        ref={(r) => { this.gasPrice = r; }}
                                        label={'Gas price'}
                                        iconClass={Icon}
                                        iconName={'pencil'}
                                        iconColor={Color.Whisper}
                                        labelStyle={{ color: Color.SILVER }}
                                        inputStyle={{ color: Color.Tomato, paddingBottom: 0, }}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        onChangeText={this.change_txt_gasPrice}
                                        showBorderBottom={false}
                                        // style={{ flex: this.state.txt_Address.length > 0 ? 9 : 8 }}
                                        value={this.state.gasPrice.toString()}
                                        onSubmitEditing={() => { }}
                                        returnKeyType="done"
                                        numberOfLines={1}
                                        keyboardType="numeric"

                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: hp('3%') }}>
                                    {
                                        this.state.gasPrice.length > 0 &&
                                        <TouchableOpacity
                                            onPress={() => this.clear_txt_gasPrice()}
                                        >
                                            <Icon name="close-circle-outline" size={font_size(3)} color={Color.Scarlet} />
                                        </TouchableOpacity>
                                    }

                                </View>
                            </View>

                            <View>
                                <Text>Transaction fee</Text>
                                <Text style={{ fontSize: font_size(2.5), fontWeight: 'bold' }}>{this.state.fee.toFixed(5)} {this.ParamNav.symbolFee}</Text>
                                <Text style={{ color: Color.Scarlet }}>{this.state.warning}</Text>
                            </View>
                        </View>


                        <View style={{ paddingHorizontal: wp('20'), marginVertical: hp('5') }}>
                            <Button
                                onpress={this.Func_button_Fee.bind(this)}
                                disable={this.state.disableButton}
                                title="Set fee"
                            />
                        </View>
                    </ScrollView>
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
    formInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: hp('2%'),
        padding: hp('1%'),
        paddingVertical: hp('3')
    },
    rowInput: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingVertical: hp('1')
    }
})

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
        paddingHorizontal: wp('2')
    },
    text: {
        color: type ? Color.Tomato : Color.Dark_gray,
        fontSize: font_size(1.5)
    }
})