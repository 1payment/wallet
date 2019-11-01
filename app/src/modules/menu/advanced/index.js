import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Switch, Alert } from 'react-native';
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import Settings from '../../../../settings/initApp'
import { bindActionCreators } from 'redux';
import { Func_Settings } from '../../../../redux/rootActions/easyMode'
import { setStorage } from '../../../../helpers/storages'
import { connect } from 'react-redux'
import BackgroundApp from '../../../components/background'


class Advanced extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enable_testNet: Settings.testnet
        };
    }

    changeSwitch = (value) => {
        this.setState({ enable_testNet: value })

        Alert.alert(
            'warning',
            'Application will reload',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => this.setState({ enable_testNet: Settings.testnet }) },
                { text: 'Ok', style: 'destructive', onPress: () => this.actionOk(value) }
            ]
        )
    }

    actionOk = (value) => {

        console.log(value)
        Settings.testnet = value;
        setStorage('setting', JSON.stringify(Settings)).then(() => {
            this.props.Func_Settings(Settings);
            this.props.navigation.navigate('InitApp')
        })
    }


    render() {
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Advanced settings"
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}

                />
                <View style={styles.container}>
                    <View style={styles.containerMenu}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Icon name="security-network" size={font_size(3)} color={Color.Success} />
                            </View>
                            <View style={{ flex: this.state.enable_testNet ? 6 : 8, justifyContent: 'center' }}>
                                <Text>Testnet</Text>
                            </View>
                            {
                                this.state.enable_testNet &&
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginHorizontal: wp('3') }}>
                                    <Text style={{ color: Color.Dark_gray }} >Rinkeby</Text>
                                </View>
                            }
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.enable_testNet}
                                    onValueChange={(value) => this.changeSwitch(value)}
                                    disabled={Settings.mode_secure ? true : false}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableHighlight
                        underlayColor="transparent"
                        style={styles.containerMenu}
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Icon name="translate" size={font_size(3)} color={Color.Steel_blue} />
                            </View>
                            <View style={{ flex: 8, justifyContent: 'center' }}>
                                <Text>Language</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Icon name="chevron-right" size={font_size(3)} />
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            </BackgroundApp>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1')
    },
    containerMenu: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: hp('2'),
        marginVertical: hp('1'),
    },
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ Func_Settings }, dispatch)
}
export default connect(null, mapDispatchToProps)(Advanced)