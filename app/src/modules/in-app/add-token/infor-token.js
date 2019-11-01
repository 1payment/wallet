import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native'
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GETAPI } from '../../../../helpers/API/';
import CHART from '../../../components/victor-chart';
import URI from '../../../../helpers/constant/uri';
import BackgroundApp from '../../../components/background'
import Settings from '../../../../settings/initApp'
import { heightPercentageToDP } from '../../../../helpers/constant/responsive';

export default class InforToken extends Component {
    state = {
        price: 0,
        percent_change: 0,
        isRefreshing: false,
    }

    componentWillMount() {
        const Item = this.props.navigation.getParam('payload');
        GETAPI(URI.MARKET_CAP_TICKER + Item.id_market)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    price: res['data']['quotes']['USD']['price'],
                    percent_change: res['data']['quotes']['USD']['percent_change_1h'],
                    isRefreshing: false
                })
            }).catch(e => this.setState({ isRefreshing: false }))
    }

    Func_refresh = () => {
        this.setState({ isRefreshing: true })
        this.componentWillMount()
    }

    render() {
        let Item = this.props.navigation.getParam('payload');
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title={`${Item.name} (${Item.symbol})`}
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}

                />
                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => {
                                    this.Func_refresh()
                                }}
                            />
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                            {
                                Item.id_market == 0 ?
                                    <View style={styles.styleCircleAvatar}>
                                        <Text style={{ fontSize: 10 }}>{Item.symbol}</Text>
                                    </View>
                                    :
                                    <Image source={{ uri: URI.MARKET_CAP_ICON + Item.id_market + '.png' }} style={{ height: 60, width: 60 }} resizeMode="contain" />
                            }
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={{
                                fontSize: 17,
                                color: Settings.mode_secure ? '#fff' : '#000'
                            }}>{this.state.price}$ <Text style={{
                                fontSize: 14,
                                color: this.state.percent_change > 0 ? Color.Malachite : Color.Scarlet
                            }}>({this.state.percent_change > 0 ? `+${this.state.percent_change}%` : `${this.state.percent_change}%`})</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginVertical: 20 }}>
                            <View style={{ flex: 4, borderBottomWidth: 1, borderBottomColor: Color.Light_gray }} />
                            <Text style={{ paddingHorizontal: 10, color: Settings.mode_secure ? '#fff' : '#000' }}>Chart</Text>
                            <View style={{ flex: 4, borderBottomWidth: 1, borderBottomColor: Color.Light_gray }} />
                        </View>
                        {
                            Item.id_market == 0 ?
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: heightPercentageToDP('30')
                                }}>
                                    <Text style={{ color: Settings.mode_secure ? '#fff' : '#000', }}>No data</Text>
                                </View>
                                :
                                <View>
                                    <CHART nameToken={Item.name} />
                                </View>
                        }
                    </ScrollView>
                </View>
            </BackgroundApp>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    styleCircleAvatar: {
        height: 45,
        width: 45,
        borderRadius: 25,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})