import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, RefreshControl, Alert, TouchableHighlight } from 'react-native';
import { Add_Token, Get_All_Token_Of_Wallet, GetAllAddressOfToken, GetAllAddressOfTokenAddress, get_All_Account, update_Balance_db, update_total_balance } from '../../../../db';
import Header from '../../../components/header';
import SwitchButton from '../../../components/switch-button';
import TokenItem from './tokenItem';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GetListToken, Func_Update_price } from '../../../../redux/rootActions/easyMode';
import { GETAPI } from '../../../../helpers/API'
import URI from '../../../../helpers/constant/uri';
import Settings from '../../../../settings/initApp'
import { getStorage, setStorage } from '../../../../helpers/storages';
import { NavigationActions, StackActions, } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import RBSheet from '../../../../lib/bottom-sheet';
import { Update_balance } from '../../../../services/index.account'
import BackgroundApp from '../../../components/background'

class Dashboard extends Component {

    mounting = true;
    state = {
        isRefreshing: false,
        mode: Settings.mode_secure,
        listAddress: []
    }
    componentDidMount() {
        if (this.mounting) {
            this.update_price_tk();
            this.load_price_data();
        }
    }

    load_price_data = () => {
        if (this.mounting) {
            Get_All_Token_Of_Wallet().then(data => {
                data.forEach((listToken, index) => {
                    let total_balance = 0;
                    listToken.account.forEach((listAccount, index) => {
                        Update_balance(listToken.address, listAccount.address, listToken.network, listToken.decimals).then(bal => {
                            total_balance += parseFloat(bal);
                            console.log(bal, total_balance)
                            update_Balance_db(listAccount.id, parseFloat(bal)).then(() => {
                                update_total_balance(listToken.id, total_balance);
                            })
                        })
                    })
                })
            })
        }
    }

    update_price_tk = () => {
        setTimeout(() => {
            if (this.props.ListToken.length > 0) {
                this.props.ListToken.forEach((item, index) => {
                    if (item.id_market !== 0) {
                        GETAPI(URI.MARKET_CAP_TICKER + item.id_market)
                            .then(res => res.json())
                            .then(res => {
                                var price = res['data']['quotes']['USD']['price'];
                                var percent_change = res['data']['quotes']['USD']['percent_change_1h'];
                                if (price > 1) {
                                    price = parseFloat(price.toFixed(2))
                                } else {
                                    price = parseFloat(price.toFixed(6))
                                }
                                this.props.Func_Update_price(item.id, price, parseFloat(percent_change))
                            })
                    } else {
                        this.props.Func_Update_price(item.id, 0, 0)
                    }

                    if (index == this.props.ListToken.length - 1) {
                        this.update_price_tk()
                    }
                });
                this.load_price_data()
            }
        }, 10000)
    }

    changeMount = () => {
        this.mounting = !this.mounting;
        console.log('mount', this.mounting)
    }

    refreshData = () => {
        if (this.props.ListToken.length > 0) {
            this.props.ListToken.forEach((item, index) => {
                if (item.id_market !== 0) {
                    GETAPI(URI.MARKET_CAP_TICKER + item.id_market)
                        .then(res => res.json())
                        .then(res => {
                            var price = res['data']['quotes']['USD']['price'];
                            var percent_change = res['data']['quotes']['USD']['percent_change_1h'];
                            if (price > 1) {
                                price = parseFloat(price.toFixed(2))
                            } else {
                                price = parseFloat(price.toFixed(6))
                            }
                            this.props.Func_Update_price(item.id, price, parseFloat(percent_change))
                        })
                } else {
                    this.props.Func_Update_price(item.id, 0, 0)
                }

                if (index == this.props.ListToken.length - 1) {
                    this.update_price_tk()
                }
            });
        }
    }

    changeSwitch = (value) => {
        this.setState({ mode: value })
        if (value) {
            Alert.alert(
                'Warning',
                'The addresses added in EZ mode will not be taken to SECURE mode and the wallet will automatically enable security features to protect the wallet better. Are you sure to switch into this mode?',
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => this.setState({ mode: Settings.mode_secure }) },
                    { text: 'Ok', style: 'destructive', onPress: () => this.switchToSecure(value) }
                ]
            )
        } else {
            Alert.alert(
                'Warning',
                'The addresses added in SECURE mode will not be taken to EZ mode. Are you sure to switch into this mode?',
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => this.setState({ mode: Settings.mode_secure }) },
                    { text: 'Ok', style: 'destructive', onPress: () => this.switchToEZ(value) }
                ]
            )
        }

    }

    rightIconClick = () => {
        this.props.navigation.navigate('QRscan', { onSelect: this.onSelect })
    }

    onSelect = (value) => {
        console.log(value)
        if (value.result == 'cancelScan') {
            return;
        }
        try {
            this.object_value = JSON.parse(value.result);
            console.log(this.object_value.chain.toLocaleLowerCase())
            if (this.object_value.token != '') {
                GetAllAddressOfTokenAddress(this.object_value.token).then(listAccount => {
                    if (listAccount) {
                        console.log('list account', listAccount)
                        try {
                            this.param_object = {
                                addressTk: listAccount['address'],
                                decimals: listAccount['decimals'],
                                network: listAccount['network'],
                                name: listAccount['name'],
                                price: listAccount['price'],
                                symbol: listAccount['symbol']
                            }
                            this.setState({ listAddress: Array.from(listAccount.account) }, () => {
                                this.RBSheet.open()
                            })
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        Alert.alert(
                            'Error',
                            'Please add account in token ' + (this.object_value.symbol).toLocaleUpperCase(),
                            [{ text: 'Ok', style: 'default' }]
                        )
                    }
                })
            } else {
                GetAllAddressOfToken(this.object_value.chain.toLocaleLowerCase())
                    .then(listAccount => {
                        if (listAccount) {
                            console.log('list account', listAccount)
                            try {
                                this.param_object = {
                                    addressTk: listAccount['address'],
                                    decimals: listAccount['decimals'],
                                    network: listAccount['network'],
                                    name: listAccount['name'],
                                    price: listAccount['price'],
                                    symbol: listAccount['symbol']
                                }
                                this.setState({ listAddress: Array.from(listAccount.account) }, () => {
                                    this.RBSheet.open()
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        } else {
                            Alert.alert(
                                'Error',
                                'Please add account in token ' + this.object_value.chain,
                                [{ text: 'Ok', style: 'default' }]
                            )
                        }
                    }).catch(e => console.log)
            }

        } catch (error) {
            console.log(error)
            Alert.alert(
                'error',
                error,
                [{ text: 'Ok', style: 'default' }]
            )
        }
    }

    chooseAddress = (item) => {
        this.RBSheet.close();
        setTimeout(() => {
            this.props.navigation.navigate('SendScreen', {
                payload: {
                    type: 'qrscan',
                    addressTK: this.param_object.addressTk,
                    decimals: this.param_object.decimals,
                    network: this.param_object.network,
                    price: this.param_object.price,
                    symbol: this.param_object.symbol,
                    item,
                    toAddress: this.object_value.to,
                    value: this.object_value.value,
                    gas: this.object_value.gas,
                    description: this.object_value.description
                }
            })
        }, 350)
    }

    switchToSecure = (value) => {
        Settings.mode_secure = value;
        Settings.testnet = false;
        setStorage('setting', JSON.stringify(Settings))
        this.props.navigation.navigate('InitApp')
    }

    switchToEZ = (value) => {
        Settings.mode_secure = value;
        setStorage('setting', JSON.stringify(Settings))
        this.props.navigation.navigate('InitApp')
    }


    componentWillUnmount() {
        this.mounting = false;
        console.log('unmount', this.mounting)
    }

    render() {
        if (this.props.ListToken.length > 0) {
            if (this.props.ListToken.findIndex(x => x.network == 'addToken') == -1) {
                var TempList = Array.from(this.props.ListToken).concat({ network: 'addToken' })
            }
        }

        return (
            <BackgroundApp>
                <Header
                    componentLeft={() => {
                        return (
                            <SwitchButton
                                // mode ez
                                inactiveButtonColor="#F2F4F4"
                                inactiveBackgroundColor={Color.Gradient_button_tomato}
                                // mode secure
                                activeButtonColor="#FFF"
                                activeBackgroundColor={['#FBFCFC', '#E9EBEC']}
                                inactiveButtonPressedColor={Color.Tomato}
                                switchHeight={35}
                                switchWidth={70}
                                buttonRadius={17}
                                onChangeState={this.changeSwitch}
                                active={this.state.mode}
                            />
                        )
                    }}
                    componentRight={() => {
                        return (
                            <TouchableOpacity
                                onPress={this.rightIconClick}
                            >
                                <Icon name="qrcode-scan" size={font_size(3)} color={Settings.mode_secure ? '#fff' : Color.Tomato} />
                                {/* <Image source={ImageApp.notification} /> */}
                            </TouchableOpacity>
                        )
                    }}
                    componentTitle={() => {
                        return (
                            this.props.TESTNET ?
                                <View>
                                    <Text style={[{ fontWeight: 'bold', fontSize: 15, color: Settings.mode_secure ? '#fff' : Color.Tomato }]}>EZ pay</Text>
                                    <Text style={{ fontSize: 10, color: Settings.mode_secure ? '#fff' : Color.Tomato, textAlign: 'center' }}>(testnet)</Text>
                                </View>
                                :
                                <Text style={[{ fontWeight: 'bold', fontSize: 15, color: Settings.mode_secure ? '#fff' : Color.Tomato }]}>EZ pay</Text>
                        )
                    }}
                // Title={`EZ Keystore \n ${this.props.TESTNET ? '(testnet)' : ''}`}
                // styleTitle={{ color: Color.Tomato }}
                />

                {
                    this.props.ListToken.length > 0 &&
                    <FlatList
                        data={TempList}
                        contentContainerStyle={{ padding: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <TokenItem
                                    InforToken={item}
                                    {...this.props}
                                    changeMount={this.changeMount}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.refreshData()}
                            />
                        }

                    />
                }
                {/******************************************************************/}
                {/* ***************** SHEET LIST WALLET BOTTOM ******************* */}
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
                                <Text style={{ fontWeight: 'bold' }}>Select a address</Text>
                            </View>
                        </View>
                        {
                            this.state.listAddress.length > 0 ?
                                <FlatList
                                    data={this.state.listAddress}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: Color.Light_gray
                                                }}
                                                onPress={() => this.chooseAddress(item)}
                                            >
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text numberOfLines={1} ellipsizeMode="middle" style={{ color: Color.Dark_gray, paddingLeft: wp('2') }}>{item.address}</Text>
                                                <Text style={{ color: Color.Dark_gray, paddingLeft: wp('2') }}>{item.balance + ' ' + this.param_object.symbol}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Please add account</Text>
                                </View>
                        }

                    </View>
                </RBSheet>
            </BackgroundApp>
        );
    }
}

const mapStateToProps = state => {
    // console.log(state.Settings.mode_secure)
    return {
        ListToken: state.Get_All_Token.ListToken,
        MODE: state.Settings.mode_secure,
        TESTNET: Settings.testnet
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Update_price }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
