import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Platform,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    Keyboard,
    ActivityIndicator,
    FlatList,
    Image,
} from 'react-native'
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Header from '../../../components/header';
import { getStorage, setStorage } from '../../../../helpers/storages';
import URI from '../../../../helpers/constant/uri'
import BackgroundApp from '../../../components/background'

export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            val_ipt_search: '',
            list_Token: [],
            loadding: false,
            isRefreshing: false
        }
        this.type_add = this.props.navigation.getParam('payload').type_add;
        this.pwd_en = this.props.navigation.getParam('payload').pwd_en
    }

    componentWillMount() {
        this.getListToken()
    }

    getListToken = () => {
        this.setState({ loadding: true })
        try {
            getStorage('list_token').then(list => {
                list = JSON.parse(list)
                this.setState({ list_Token: list, loadding: false })
            })

        } catch (error) {
            this.setState({ loadding: false })
            console.log('sss', error)
        }
    }

    find_Token = (key_search: string) => {
        var tempArr = [];
        this.state.list_Token.forEach((item, index) => {
            var re = new RegExp(key_search, 'i')
            var in_name = item.name.match(re);
            var in_symbol = item.symbol.match(re);
            if (in_name != null || in_symbol != null) {
                tempArr.push(item);
            }
            if (index == this.state.list_Token.length - 1) {
                this.setState({ list_Token: tempArr })
            }
        })
        if (key_search == '') {
            this.getListToken();
        }
    }

    change_text_search = (val) => {
        this.setState({ val_ipt_search: val })
        this.find_Token(val)
    }

    clear_input_search = () => {
        this.setState({ val_ipt_search: '' });
        this.getListToken();
    }

    _renderItem = ({ index, item }) => {
        let ic_token;
        switch (item.network) {
            case 'ethereum':
                if (item.address == '') {
                    ic_token = ImageApp.ic_eth_token;
                    break;
                } else {
                    ic_token = 'ERC20'
                    break;
                }
            case 'nexty':
                if (item.address == '') {
                    ic_token = ImageApp.ic_nty_token;
                    break;
                } else {
                    ic_token = 'ERC20'
                    break;
                }
            default:
                if (item.address == '') {
                    ic_token = ImageApp.ic_trx_token;
                    break;
                } else {
                    ic_token = 'TRC20'
                    break;
                }
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('Add_Token', {
                        payload: {
                            type_add: this.type_add,
                            item,
                            pwd_en: this.pwd_en
                        }
                    })
                }}
            >
                <View style={[styles.styleRowItem, { backgroundColor: item.type == true ? Color.Wild_sand : '#fff' }]}>
                    <View style={styles.styleColumnAvatarItem}>
                        {
                            item.id_market == 0 ?
                                <View style={styles.styleCircleAvatar}>
                                    <Text style={{ fontSize: 10 }}>{ic_token}</Text>
                                </View>
                                :
                                <Image source={{ uri: URI.MARKET_CAP_ICON + item.id_market + '.png' }} style={{ height: 40, width: 40 }} resizeMode="contain" />
                        }
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row' }}>
                        <View style={{ flex: 8, justifyContent: 'center' }}>
                            <Text style={{ color: item.type == true ? Color.Dark_gray : '#000' }}>{item.name} (<Text>{item.symbol}</Text>)</Text>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            {/* <TouchableOpacity
                                onPress={() => this.show_sheet_bottom(item)}
                            >
                                <Icon name={item.type == true ? 'close-circle' : 'plus-circle'} color={item.type == true ? Color.Scarlet : Color.Malachite} size={30} />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }


    render() {
        return (
            <BackgroundApp in_app={false}>
                <Header
                    IconLeft={"arrow-back"}
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Select token"
                    styleTitle={{ color: "#fff" }}
                    colorIconLeft='#fff'
                    colorIconRight="#fff"
                />

                <View style={styles.ViewSearch}>
                    <View style={styles.viewInputSearch}>
                        <View style={{ flex: 8, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: this.state.val_ipt_search.length > 0 ? 9 : 10,
                                    borderBottomWidth: 0,
                                    paddingVertical: Platform.OS == 'ios' ? 6 : 2
                                }}
                                placeholder="search token"
                                // autoFocus={true}
                                underlineColorAndroid="transparent"
                                onChangeText={this.change_text_search}
                                value={this.state.val_ipt_search}
                            />
                            {
                                this.state.val_ipt_search.length > 0 &&
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center' }}
                                    onPress={this.clear_input_search}
                                >
                                    <Icon name="close-circle" size={25} />
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                    <TouchableOpacity style={styles.styleButtonSearch}>
                        <Icon name="magnify" color={'#fff'} size={35} />
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    {
                        !this.state.loadding && this.state.list_Token.length > 0 ?
                            <FlatList
                                data={this.state.list_Token}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={() => {
                                            Keyboard.dismiss();
                                            this.clear_input_search()
                                        }}
                                    />
                                }
                                keyboardDismissMode="interactive"
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    !this.state.loadding && this.state.list_Token.length == 0 ?
                                        <Text style={{ color: '#fff' }}>Token <Text style={{ fontWeight: 'bold' }}>"{this.state.val_ipt_search}"</Text> is not found</Text>
                                        :
                                        <ActivityIndicator size="large" style={{ flex: 1 }} color={Color.Tomato} />
                                }
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
        padding: hp('2'),
    },
    ViewSearch: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    viewInputSearch: {
        flex: 8.5,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    styleButtonSearch: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleRowItem: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.04,
        shadowRadius: 1.5,
        elevation: 2,
    },
    styleColumnAvatarItem: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleCircleAvatar: {
        height: 40,
        width: 40,
        borderRadius: 25,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})