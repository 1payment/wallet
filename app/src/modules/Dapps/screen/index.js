import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform,
    FlatList,
    Image,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Header from '../../../components/header';
import Color from '../../../../helpers/constant/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from '../../../../lib/bottom-sheet'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import { GetAllAddressOfToken } from '../../../../db'
import BackgroundApp from '../../../components/background';
import Settings from '../../../../settings/initApp'


const dumpData = [
    {
        title: 'Elotto',
        subTitle: "Elotto is a decentralized DApp platform. Play per to per without house, all actions are performed by smart contract.",
        url: 'http://45.76.156.99',
        img: 'http://45.76.156.99/assets/images/favico.png'
    },
    {
        title: 'Kyber Network',
        subTitle: 'An instant decentralized cryptocurrency exchange service.',
        url: 'https://web3.kyber.network',
        img: 'https://cdn.cryptostats.net/assets/images/coins/310497-KNC.png'
    },
    {
        title: 'IDEX',
        subTitle: 'IDEX is a decentralized exchange for trading Ethereum tokens.',
        url: 'https://idex.market/',
        img: 'https://idex.market/static/images/favicon-logo-wt-trans.png'
    },
    {
        title: 'OpenSea',
        subTitle: 'A peer-to-peer marketplace for rare digital items and crypto collectibles. Buy, sell, auction, and discover CryptoKitties, blockchain game items, and much more.',
        url: 'https://opensea.io',
        img: 'https://pbs.twimg.com/profile_images/988983240458305538/KNIW8ufg_400x400.jpg'
    },
    {
        title: 'Etheremon',
        subTitle: 'A world of Ether monster where you can captures, transform,...',
        url: 'https://www.etheremon.com',
        img: 'https://pbs.twimg.com/profile_images/960520740196909056/3RBArulO_400x400.jpg'
    },
    {
        title: '0x Portal',
        subTitle: 'An Open Protocol For Decentralized Exchange On The Ethereum Blockchain.',
        url: 'https://www.0xproject.com/portal',
        img: 'https://www.bebit.fr/wp-content/uploads/2018/04/0x-.png'
    },
    {
        title: 'Fork Delta',
        subTitle: 'A decentralized Ethereum Token Exchange with the most ERC20 listings of any exchange',
        url: 'https://forkdelta.app',
        img: 'https://forkdelta.io/images/logo.png'
    }
]

const data = Platform.OS === 'ios'
    ? [{
        title: 'Cryptokitties',
        subTitle: "The world's first blockchain games. Breed your rarest cats to create the purrfect furry friend. The future is meow!",
        url: 'https://www.cryptokitties.co',
        img: 'https://vignette.wikia.nocookie.net/cryptokitties/images/7/7f/Kitty-eth.png/revision/latest?cb=20171202061949'
    }, {
        title: 'DDEX',
        subTitle: 'DDEX is the first decentralized exchange built on Hydro Protocol...',
        url: 'https://ddex.io',
        img: 'https://pbs.twimg.com/profile_images/996789325823074304/huBkgZg4.jpg'
    }, ...dumpData]
    : dumpData



export default class ListDapp extends Component {
    state = {
        listAddress: []
    }

    componentWillMount() {
        GetAllAddressOfToken('Ethereum').then(listAddress => {
            console.log(Array.from(listAddress.account))
            this.setState({ listAddress: Array.from(listAddress.account) })
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.ready = true
        }, 650)
    }

    _ShowRBSheet = (item) => {
        this.url = item.url;
        this.RBSheet.open();
    }

    chooseAddress = (item) => {
        this.RBSheet.close()
        setTimeout(() => {
            this.props.navigation.navigate('DappBrowser', {
                payload: {
                    url: this.url,
                    address: item.address,
                    network: '',
                    pk_en: item.private_key
                },
                hideTab: true
            })
        }, 200);
    }

    render() {
        return (
            <BackgroundApp>
                <Header
                    Title='List Dapps'
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                />
                <View style={styles.container}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => `${item.title}-${index}`}
                        contentContainerStyle={{ paddingHorizontal: hp('2') }}
                        renderItem={({ item, index }) => {
                            return (
                                <DAppListItem
                                    title={item.title}
                                    subTitle={item.subTitle}
                                    // line={index != 0}
                                    img={{ uri: item.img }}
                                    onPress={() => this._ShowRBSheet(item)}
                                />
                            )

                        }}
                    />
                </View>
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
                                                <Text numberOfLines={1} ellipsizeMode="middle" style={{ color: Settings.mode_secure ? '#fff' : Color.Dark_gray, paddingLeft: wp('2') }}>{item.address}</Text>
                                                <Text style={{ color: Settings.mode_secure ? Color.SILVER : Color.Dark_gray, paddingLeft: wp('2') }}>{item.balance} ETH</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Dapp only working on Ethereum!</Text>
                                </View>
                        }

                    </View>
                </RBSheet>
            </BackgroundApp>
        );
    }
}

class DAppListItem extends Component {
    render() {
        const {
            title,
            subTitle,
            onPress,
            line,
            img,
        } = this.props
        return (
            <View style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                marginVertical: hp('1')
            }}>
                <TouchableOpacity onPress={onPress}>
                    <View style={stylesItem.container}>
                        {
                            img.uri ?
                                <Image
                                    source={img}
                                    style={stylesItem.image}
                                    resizeMode="contain"
                                />
                                :
                                <View style={[stylesItem.image]}>

                                </View>
                        }

                        <View style={stylesItem.viewStyle}>
                            <Text style={stylesItem.titleStyle}>{title}</Text>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={stylesItem.subTitleStyle}
                            >
                                {subTitle}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const stylesItem = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: hp(1)
    },
    image: {
        flex: 2,
        padding: 5
    },
    viewStyle: {
        flex: 8,
    },
    titleStyle: {
        color: Color.Cadet_blue,
        fontSize: 16,
    },
    subTitleStyle: {
        color: '#8A8D97',
        fontSize: 14,
        marginTop: 5
    },
})
