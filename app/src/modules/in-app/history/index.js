import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Image
} from 'react-native';
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import { getDataHistory, HistoryModel } from './history.service'
// import Icon from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import BackgroundApp from '../../../components/background'
import Settings from '../../../../settings/initApp'


class TransactionModal {
    tx: string;
    type: string;
    quantity: string;
    datetime: string;
    data: HistoryModel;
    isToken: Boolean
}

let list_transactions: TransactionModal[];

export default class History extends Component {
    page = 1;
    state = {
        transactions: list_transactions,
        index: 0,
        isLoading: true,
        isRefreshing: false,
    };
    stopLoadMore = false;

    componentWillMount() {
        const { address, network, decimals, addressTK } = this.props.navigation.getParam('payload');
        this.paramNav = this.props.navigation.getParam('payload');
        this.getTransaction()
    }

    getTransaction = () => {
        this.setState({ isRefreshing: true, transactions: [], isLoading: true });
        getDataHistory(1, this.paramNav.address, this.paramNav.network, this.paramNav.decimals, this.paramNav.addressTK).then(async data => {
            console.log('data', data)
            try {
                list_transactions = await this.getFullTransaction(data, this.paramNav.address);
            } catch (error) {
                console.log(error)
            }
            await this.setState({
                transactions: list_transactions,
                index: list_transactions.length,
                isLoading: false,
                isRefreshing: false
            })
        }).catch(e => {
            this.setState({
                isLoading: false,
                isRefreshing: false
            })
        })

    }

    getFullTransaction(listTransaction, address): TransactionModal[] {
        let transactions = [];
        for (let entry of listTransaction) {
            let type = 'arrow-top-right';
            if (entry.to.toLowerCase() == address.toLowerCase()) {
                type = 'arrow-bottom-left'
            }
            let transaction = new TransactionModal();
            transaction.tx = entry.tx;
            transaction.type = type;
            transaction.quantity = entry.value;
            transaction.datetime = entry.time.format("YYYY-MM-DD HH:mm:ss");
            transaction.data = entry;
            transaction.isToken = entry.isToken;
            transactions.push(transaction)
        }
        return transactions;
    }

    onEndReached() {
        if (!this.stopLoadMore) {
            console.log('call onEndReached')
            this.stopLoadMore = true;
            setTimeout(() => {
                try {
                    this.page++
                    getDataHistory(this.page, this.paramNav.address, this.paramNav.network, this.paramNav.decimals, this.paramNav.addressTK)
                        .then(async data => {
                            await this.getFullTransaction(data, this.paramNav.address).forEach(async (element, index) => {
                                list_transactions.push(element);
                                if (index == await this.getFullTransaction(data, this.paramNav.address).length - 1) {
                                    this.stopLoadMore = false;
                                }
                            });
                            await this.setState({ index: list_transactions.length })
                            console.log(this.page)
                        }).catch((err) => {
                            console.log('err', err)
                        })

                } catch (error) {
                    console.log(error)
                }
            }, 1000);
        }
    }

    render() {
        const { address, network, decimals } = this.props.navigation.getParam('payload')

        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="History"
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}

                />
                <View style={{ flex: 1 }}>
                    {
                        this.state.isLoading ?
                            <View style={styles.container}>
                                <View style={{
                                    backgroundColor: '#fff',
                                    flex: 1,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.14,
                                    shadowRadius: 2.27,
                                    elevation: 2,
                                    borderRadius: 10,
                                }}>
                                    <ActivityIndicator size="large" style={{ flex: 1 }} color={Color.Tomato} />
                                </View>
                            </View>
                            :
                            <View style={styles.container}>
                                <View style={{
                                    backgroundColor: '#fff',
                                    flex: 1,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.14,
                                    shadowRadius: 2.27,
                                    elevation: 2,
                                    borderRadius: 10,
                                }}>
                                    {
                                        this.state.transactions.length > 0
                                            ?
                                            <FlatList
                                                style={{ padding: hp('2%') }}
                                                data={this.state.transactions}
                                                extraData={this.state}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => this.props.navigation.navigate("Detail_history", {
                                                                payload: {
                                                                    data: item,
                                                                    network: network,
                                                                    address: address,
                                                                    decimals: decimals
                                                                }
                                                            })}
                                                            style={styles.row}>
                                                            <Icon
                                                                active
                                                                name={item.type}
                                                                style={{ color: item.type == "arrow-bottom-left" ? "green" : 'red', flex: 1 }}
                                                                size={wp('6%')}
                                                            />
                                                            <Text style={{
                                                                flex: 7,
                                                                fontSize: wp('4%')
                                                            }}>{item.datetime}</Text>
                                                            {/* <View style={{
                                                                flex: 1.5,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Text style={{
                                                                    fontSize: wp('3%'),
                                                                    color: Color.Tomato
                                                                }}>{item.isToken ? 'Token' : ''}</Text>
                                                            </View> */}
                                                            <Icon
                                                                name="chevron-right"
                                                                style={{ flex: 1, textAlign: 'right' }}
                                                                size={wp('6%')}
                                                                color="#AAA"
                                                            />
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                                onEndReached={() => this.onEndReached(network)}
                                                onEndReachedThreshold={0.0001}
                                                keyExtractor={(item, index) => index.toString()}
                                                refreshControl={
                                                    <RefreshControl  //Component cho chức năng Pull to Refresh
                                                        refreshing={this.state.isRefreshing}  // check xem có hành động Pull trên màn hình của user hay không
                                                        onRefresh={() => this.getTransaction()} // mỗi lần pull thì sẽ thực hiện hàm getData để load dữ liệu về
                                                    ></RefreshControl>
                                                }

                                            />
                                            :
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <Icon name="exclamation-circle" color="#d1d1d1" size={hp('20%')} /> */}
                                                <Image source={ImageApp.nothing_transaction} style={{ height: hp('25'), width: hp('25') }} resizeMode="center" />
                                                <Text style={{ fontSize: font_size('2'), fontWeight: 'bold', marginTop: hp('2') }}>Nothing here</Text>
                                                <Text style={{ fontSize: font_size('2') }}>You don't have any pending transactions.</Text>
                                            </View>
                                    }

                                </View>
                            </View>
                    }
                </View>
            </BackgroundApp>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2%')
    },
    row: {
        paddingVertical: hp('3%'),
        paddingHorizontal: hp('2%'),
        flexDirection: 'row',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#AAA',
        marginLeft: Platform.OS == 'android' ? wp('5%') : 'auto',
    }
})
