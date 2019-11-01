import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar,
    Modal,
    Image,
    Alert
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import Header from '../../../components/header';
import { generate_space } from '../add-token/add-token.service'
import { Create_account_secure } from '../../../../services/index.account'
import { InitData } from '../../../../db';
import { GetListToken, Func_Settings } from '../../../../redux/rootActions/easyMode';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListToken from '../../../../helpers/constant/listToken';
import Setting from '../../../../settings/initApp';
import { getStorage, setStorage } from '../../../../helpers/storages';
import Button from '../../../components/button'
import BackgroundApp from '../../../components/background'


class LoadingSecure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            veryfy_wordlist: [],
            wordlist_random_view: [],
            wordlist: [],
            error_wordlist: false,
            enable_button: false,
            showModal: false,
        };
    }

    loadData = () => {
        this.setState({
            wordlist_random_view: this.props.navigation.getParam('payload').random_wordlist,
            wordlist: this.props.navigation.getParam('payload').wordlist
        })
        console.log('word list', this.props.navigation.getParam('payload').wordlist)
    }
    componentWillMount() {
        this.loadData()
    }

    select_verify_wordlist = (word, index_item, index_arrray) => {
        var temp_verify_wordlist = this.state.veryfy_wordlist;
        temp_verify_wordlist.splice(index_arrray, 1);
        this.setState({ veryfy_wordlist: temp_verify_wordlist });
        var temp_wordlist = this.state.wordlist_random_view;
        temp_wordlist[index_item] = word;
        this.setState({ wordlist_random_view: temp_wordlist }, this.check_remove_compare)
    }

    check_remove_compare = () => {
        if (this.state.veryfy_wordlist.length > 0) {
            for (let i = 0; i < this.state.veryfy_wordlist.length; i++) {
                if (this.state.veryfy_wordlist[i]['word'] == this.state.wordlist[i]) {
                    this.setState({ error_wordlist: false })
                } else {
                    this.setState({ error_wordlist: true })
                }
            }
        } else {
            this.setState({ error_wordlist: false })
        }


        if (this.state.error_wordlist == true && this.state.veryfy_wordlist.length !== 12) {
            this.setState({ enable_button: false })
        } else {
            this.setState({ enable_button: true })
        }
    }

    _render_item = ({ item, index }) => {
        return (
            <TouchableHighlight
                onPress={() => this.select_verify_wordlist(item.word, item.index, index)}
            >
                <View style={styleItem.container}>
                    <Text style={{ color: Color.Tomato }}>{index + 1}. </Text>
                    <Text style={{ color: Color.Tomato }}>{item.word}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    select_random_wordlist = async (word, index) => {
        var temp_wordlist = this.state.wordlist_random_view;
        temp_wordlist[index] = temp_wordlist[index].replace(word, await generate_space(word))
        this.setState({ wordlist_random_view: temp_wordlist });
        var temp_verify_wordlist = this.state.veryfy_wordlist;
        temp_verify_wordlist.push({ index, word })
        this.setState({ veryfy_wordlist: temp_verify_wordlist }, this.check_add_compare)
    }

    check_add_compare = () => {
        // var condition = this.state.veryfy_wordlist[this.state.veryfy_wordlist.length - 1]['word'] === this.state.wordlist[this.state.veryfy_wordlist.length - 1]
        // if (condition) {
        //     this.setState({ error_wordlist: false })
        // } else {
        //     this.setState({ error_wordlist: true })
        // }

        for (let i = 0; i < this.state.veryfy_wordlist.length; i++) {
            if (this.state.veryfy_wordlist[i]['word'] == this.state.wordlist[i]) {
                this.setState({ error_wordlist: false })
            } else {
                this.setState({ error_wordlist: true })
            }
        }

        if (this.state.error_wordlist == false && this.state.veryfy_wordlist.length == 12) {
            this.setState({ enable_button: true })
        }
    }

    goToDashboard = () => {
        if (this.state.veryfy_wordlist.length == 12) {
            this.setState({ showModal: true })
            setTimeout(() => {
                const { type_add, item, pwd_en, wordlist_string } = this.props.navigation.getParam('payload');
                Create_account_secure(wordlist_string, 0, item.network, pwd_en).then(wallet => {
                    console.log(wallet.node, wallet.seed)
                    this.setState({ showModal: false })
                    var ID = Math.floor(Date.now() / 1000);
                    // const item = this.props.navigation.getParam('payload').item
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
                                        StatusBar.setBarStyle('dark-content', true)
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
        } else {
            this.setState({ enable_button: false })
        }
    }

    _render_item2 = ({ item, index }) => {
        return (
            <TouchableHighlight onPress={() => this.select_random_wordlist(item, index)} >
                <View style={[styleItem.container, { width: item == '' ? wp('10') : 'auto' }]}>
                    <Text style={{ color: Color.Tomato }} >{item}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <BackgroundApp in_app={false}>
                <Header
                    IconLeft={"arrow-back"}
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Confirm phrase"
                    styleTitle={{ color: "#fff" }}
                    colorIconLeft='#fff'
                    colorIconRight="#fff"
                />
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.form}>
                            <Text style={styles.title}>Verify recovery phrase</Text>
                            <Text style={styles.content}>Tap the words to put them next to each other in the correct order.</Text>
                        </View>
                        <View style={styles.form}>
                            {
                                this.state.veryfy_wordlist.length > 0 ?
                                    <FlatList
                                        data={this.state.veryfy_wordlist}
                                        renderItem={this._render_item}
                                        keyExtractor={(index, item) => item.toString()}
                                        style={styles.formPhrase}
                                        contentContainerStyle={{ padding: hp('1') }}
                                        numColumns={4}
                                        horizontal={false}
                                    />
                                    :
                                    <View style={[styles.formPhrase, { height: hp('20') }]}>

                                    </View>
                            }

                        </View>
                        {
                            this.state.error_wordlist &&
                            <Text style={{ color: '#fff' }}> Invalid order. Try again!</Text>
                        }
                        <View style={styles.form}>
                            <FlatList
                                data={this.state.wordlist_random_view}
                                renderItem={this._render_item2}
                                keyExtractor={(index, item) => index.toString()}
                                style={styles.formPhrase}
                                contentContainerStyle={{ padding: hp('1'), alignItems: 'center' }}
                                numColumns={4}
                                horizontal={false}
                            />
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
                                    style={styles.styleButton}
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

            </BackgroundApp >
        );
    }
}

const styleItem = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Color.Tomato,
        flexDirection: 'row',
        padding: 5,
        borderRadius: 4,
        margin: 5,
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2'),
    },
    form: {
        marginVertical: hp('2')
    },
    title: {
        textAlign: 'center',
        fontSize: font_size('3'),
        fontWeight: 'bold',
        color: "#fff",
    },
    content: {
        textAlign: 'center',
        color: "#fff",
        fontStyle: "italic"
    },
    formPhrase: {
        backgroundColor: "#fff",
        borderRadius: 15,
    },
    styleButton: {
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

export default connect(null, mapDispatchToProps)(LoadingSecure)

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