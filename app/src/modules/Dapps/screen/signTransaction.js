import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Color from '../../../../helpers/constant/color';
import Header from '../../../components/header';
import { utils } from 'ethers';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Settings from '../../../../settings/initApp'
import { signTransaction } from '../dapp.service'
import FormPassword from './confirm-password'
import { DecodeInput } from '../../../../services/ETH/account.service'
import { GETAPI } from '../../../../helpers/API'
import URI from '../../../../helpers/constant/uri';
import BackgroundApp from '../../../components/background';
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

export default class signTransactionDapps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usd: 0,
            dataInput: '',
            selectFee: 'Average',
            gasFee: 0.00021,
            gasPrice: 10
        };
        this.params = this.props.navigation.state.params;
    }

    SelectFee = (title, fee, gasPrice) => {
        this.setState({ selectFee: title, gasPrice: gasPrice, gasFee: fee })
    }

    onSignPersonalTransaction() {
        if (Settings.ez_turn_on_passcode) {
            this.modalConfirm.openModal(this.params)
        } else {
            const { params } = this.props.navigation.state;
            console.log(params)
            signTransaction(
                this.state.passcode,
                this.state.gasPrice,
                params.pk_en,
                params.object,
            ).then((tx) => {
                console.log(tx)
                params.callBack(params.id, tx);
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



    componentWillMount() {
        const { ViewObject } = this.props.navigation.state.params;

        GETAPI(URI.MARKET_CAP_TICKER + '1027')
            .then(res => res.json())
            .then(res => {
                var price = res['data']['quotes']['USD']['price'];
                if (price > 1) {
                    price = parseFloat(price.toFixed(2))
                } else {
                    price = parseFloat(price.toFixed(6))
                }
                this.setState({ usd: price * parseFloat(ViewObject.value) })
            })
        const { params } = this.props.navigation.state;
        DecodeInput(params.object.data).then(input => {
            console.log(input)
        }).catch(e => console.log(e))
    }

    render() {
        const { id, object, url, ViewObject } = this.props.navigation.state.params;
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title='Sign Transaction'
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <View style={[styles.container]}>
                    <ScrollView
                        contentContainerStyle={{ padding: hp('2') }}
                    >
                        <View style={styles.formAddress}>
                            <View style={[styles.item]}>
                                <Text style={styles.key}>
                                    From
                                </Text>
                                <Text style={[styles.standardText,]} numberOfLines={1} ellipsizeMode="middle">
                                    {object.from}
                                </Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.item]}>
                                <Text style={styles.key}>To</Text>
                                <Text style={[styles.standardText,]} numberOfLines={1} ellipsizeMode="middle">
                                    {object.to}
                                </Text>
                            </View>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.fromAmount}>
                            <View style={[styles.item]}>
                                <Text style={styles.key}>Amount</Text>
                                <Text style={[styles.standardText, { color: Color.Tomato, fontSize: font_size(3) }]}>{ViewObject.value}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 8 }}>~{this.state.usd}</Text>
                                <Text style={{ flex: 2, textAlign: 'right' }}>USD</Text>
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.item,]}>
                                <Text style={styles.key}>Dapp</Text>
                                <Text style={[styles.standardText,]}>
                                    {url}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingVertical: hp('1%'), marginTop: hp('1') }}>
                                {
                                    TransactionFee.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index.toString()}
                                                style={[styleButton(this.state.selectFee === item.title).button]}
                                                onPress={() => this.SelectFee(item.title, item.fee, item.gasPrice)}
                                            >
                                                <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.title}</Text>
                                                <Text style={[styleButton(this.state.selectFee === item.title).text]}>{item.fee + ' ETH'}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>


                        <View style={{ justifyContent: 'center', paddingHorizontal: wp('20%'), marginTop: hp('3') }}>
                            <Button
                                title="Sign"
                                onpress={this.onSignPersonalTransaction.bind(this)}
                                disable={false}
                            />
                        </View>
                    </ScrollView>
                </View>

                <FormPassword
                    ref={r => this.modalConfirm = r}
                    type='sign_transaction'
                    {...this.props}
                    gasPrice={this.state.gasPrice}
                />
            </BackgroundApp>
        );
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
    container: {
        flex: 1,
    },
    standardText: {
        fontSize: font_size(2.5),
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
    formAddress: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: hp('3'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.27,
        elevation: 7,
    },
    fromAmount: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
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