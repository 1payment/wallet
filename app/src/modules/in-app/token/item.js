import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import Accordion from '../../../../lib/collapse';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import TextTicker from '../../../../lib/react-native-text-ticker'


interface data {
    id: number,
    name: string,
    address: string,
    private_key: string,
    balance: number,
}

export default class AccordionView extends Component {

    componentWillMount() {
        this.RefrestData()
    }

    RefrestData = () => {
        this.ListData = [];
        const { data } = this.props;
        this.symbol = data.symbol;
        this.name = data.name;
        this.decimals = data.decimals;
        this.id_market = data.id_market;
        this.network = data.network;
        this.price = data.price
        this.address = data.address

        data.account.forEach(element => {
            this.ListData.push(element)
        });
        this.setState({ ListAccount: JSON.parse(JSON.stringify(this.ListData)) })
    }
    componentWillReceiveProps(newProps) {
        this.ListData = [];
        newProps.data.account.forEach(element => {
            this.ListData.push(element)
        });
        this.setState({ ListAccount: JSON.parse(JSON.stringify(this.ListData)) })
    }

    state = {
        activeSections: [0],
        ListAccount: []
    };


    _renderHeader = (section, key, active, sections) => {
        return (
            <View style={[styleHeader(!active).header]}>
                <Text style={styles.headerName}>{section.name}</Text>
                {
                    section.balance.toString().length > 8 ?
                        <TextTicker
                            style={styles.headerBalance}
                            duration={5000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={0}
                        >
                            {section.balance}
                        </TextTicker>
                        :
                        <Text style={styles.headerBalance}>{section.balance}</Text>
                }
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('InforAccount', {
                        payload: {
                            section,
                            symbol: this.symbol,
                            addressTK: this.address,
                            funcReload: this.RefrestData,
                            lengthAccount: this.state.ListAccount.length,
                            name: this.name
                        }
                    })}
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    }}
                >
                    <Icon name="pencil" color={Color.Tomato} size={25} />
                </TouchableOpacity>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.buttonContent}
                    onPress={() => this.props.navigation.navigate('ReceiveAccount', {
                        payload: {
                            item: section,
                            id_market: this.id_market,
                            symbol: this.symbol,
                            decimals: this.decimals,
                            addressTK: this.address
                        }
                    })}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.textButton} >Receive</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Icon
                            name="qrcode"
                            color={Color.Tomato}
                            size={font_size(3)}
                        />
                    </View>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonContent}
                    onPress={() => this.props.navigation.navigate('History', {
                        payload: {
                            address: section.address,
                            network: this.network,
                            decimals: this.decimals,
                            addressTK: this.address
                        }
                    })}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.textButton} >History</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Icon
                            name="history"
                            color={Color.Tomato}
                            size={font_size(3)}
                        />
                    </View>

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonContent}
                    onPress={() => this.props.navigation.navigate('SendScreen', {
                        payload: {
                            type: '',
                            item: section,
                            symbol: this.symbol,
                            decimals: this.decimals,
                            addressTK: this.address,
                            network: this.network,
                            price: this.price
                        }
                    })}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.textButton} >Send</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Icon
                            name="send"
                            color={Color.Tomato}
                            size={font_size(3)}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        return (
            <Accordion
                sections={this.state.ListAccount}
                activeSections={this.state.activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
                underlayColor="transparent"
            />
        );
    }
}

const styleHeader = (status) => StyleSheet.create({
    header: {
        backgroundColor: '#FFF',
        padding: 15,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: status ? 10 : 0,
        borderBottomRightRadius: status ? 10 : 0,
        marginTop: 10,
        flexDirection: 'row',
    },
})

const styles = StyleSheet.create({
    content: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: 'row'
    },
    buttonContent: {
        flex: 3.3,
        borderWidth: 1,
        borderColor: Color.Tomato,
        borderRadius: 5,
        flexDirection: 'row',
        padding: 5,
        marginHorizontal: 5,
        justifyContent: 'space-around'
    },
    textButton: {
        flex: 5,
        color: Color.Tomato,
        fontWeight: 'bold',
        fontSize: font_size(2),
        textAlign: 'center'
    },
    headerName: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 4,
        color: Color.Dark_gray
    },
    headerBalance: {
        textAlign: 'right',
        fontSize: 30,
        fontWeight: 'bold',
        flex: 4,
        color: Color.Dark_gray
    }
})
