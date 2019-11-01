import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import URI from '../../../helpers/constant/uri'
import { VictoryArea, VictoryStack, VictoryChart, VictoryAxis } from "victory-native";
// import Language from '../../../i18n/i18n'
import { Defs, Stop, LinearGradient } from 'react-native-svg';
import Color from '../../../helpers/constant/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as fontsize } from '../../../helpers/constant/responsive';
import CONSTANTS from '../../../helpers/constant'
import Settings from '../../../settings/initApp';


const { height, width } = Dimensions.get('window')
export default class Chart extends Component {
    mounted: boolean = true;
    currencies: string = '';
    constructor(props) {
        super(props)
        this.state = {
            DataChart: [],
            selected: 'D'
        };

    };

    componentDidMount() {
        let { nameToken } = this.props;
        this.currencies = (nameToken.toLocaleLowerCase()).replace(/[ .]/g, '-');
        console.log('currencies', this.currencies);
        if (this.mounted) {
            this.changeChart('W', this.currencies)
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }


    changeChart(type) {
        this.setState({ DataChart: [], selected: type })
        var time = new Date;
        var url = '';
        switch (type) {
            case 'D': {
                url = URI.MARKET_CAP_DATACHART + '/' + this.currencies + '/' + (time.getTime() - URI.TIME.DAY) + '/' + time.getTime() + '/'
            }
                break;
            case 'W': {
                url = URI.MARKET_CAP_DATACHART + '/' + this.currencies + '/' + (time.getTime() - URI.TIME.WEEK) + '/' + time.getTime() + '/'
            }
                break;
            case 'M': {
                url = URI.MARKET_CAP_DATACHART + '/' + this.currencies + '/' + (time.getTime() - URI.TIME.MONTH) + '/' + time.getTime() + '/'
            }
                break;
            default: {
                url = URI.MARKET_CAP_DATACHART + '/' + this.currencies + '/'
            }
                break;
        }

        try {
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    var tempData = [];
                    var i = 0;
                    response['price_usd'].forEach(element => {
                        i++;
                        tempData.push({
                            x: element[0],
                            y: element[1]
                        })
                        if (i == response['price_usd'].length - 1) {
                            this.setState({ DataChart: tempData })
                        }
                    });
                })
        } catch (error) {
            console.log('e' + error);
        }

    }



    render() {
        var HorizontalData = [
            {
                type: 'D',
                show: "Day"
            },
            {
                type: 'W',
                show: 'Week'
            },
            {
                type: 'M',
                show: 'Month'
            },
            {
                type: 'ALL',
                show: 'All'
            },
        ]
        return (
            <View style={styles.container}>
                {this.state.DataChart.length > 0 ?
                    <VictoryChart
                        height={hp('40%')}
                        padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    >
                        <Defs>
                            <LinearGradient id="gradientStroke"
                                x1="0%"
                                x2="0%"
                                y1="50%"
                                y2="100%"
                            >
                                <Stop offset="0%" stopColor={Settings.mode_secure ? '#30d38c' : "#30C7D3"} stopOpacity="0.7" />
                                <Stop offset="100%" stopColor={Settings.mode_secure ? '#30d38c' : "#30C7D3"} stopOpacity="0.01" />
                            </LinearGradient>
                        </Defs>
                        <VictoryArea
                            style={{
                                data: {
                                    // fill: "#30C7D3",
                                    // fillOpacity: 0.3,
                                    // stroke: "#30C7D3",
                                    // strokeWidth: 2,
                                    fill: 'url(#gradientStroke)',
                                    stroke: Settings.mode_secure ? '#30d38c' : '#1aa1ab',
                                    strokeWidth: 1.5
                                },
                                axisLabel: { fontSize: 16, fill: '#E0F2F1' },
                            }}
                            data={this.state.DataChart}
                            // animate={{
                            //     duration: 2000,
                            //     onLoad: { duration: 1000 }
                            // }}
                            padding={{ top: 20, bottom: 0, left: 10, right: 10 }}
                        >
                        </VictoryArea>
                        <VictoryAxis style={{ axis: { stroke: "none" } }} tickFormat={() => ''}
                        />
                    </VictoryChart>
                    :
                    <View style={{ width: width, height: hp('40%'), justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading</Text>
                    </View>
                }
                <FlatList
                    style={{
                        marginTop: 5,
                        borderBottomWidth: 0.25, borderBottomColor: '#cecece'
                    }}
                    // horizontal={true}
                    numColumns={4}
                    data={HorizontalData}
                    renderItem={({ item, index }) => {
                        return (
                            // <HorizontalItem item={item} index={index} parentlatLis={this} />
                            <TouchableOpacity
                                onPress={() =>
                                    this.state.DataChart.length > 0 ?
                                        this.changeChart(item.type)
                                        : console.log('aaa')
                                }
                                style={
                                    selectedBtn(this.state.selected === item.type).selected
                                }
                            >
                                <View >
                                    <Text style={[styles.text, selectedBtn(this.state.selected === item.type).text, { color: Settings.mode_secure ? '#fff' : '#000' }]}>{item.show}</Text>
                                    {
                                        this.state.selected === item.type &&
                                        <View style={{
                                            height: 2,
                                            backgroundColor: Settings.mode_secure ? '#fff' : '#30C7D3',
                                            // borderBottomWidth: 1,
                                            // borderColor: '#30C7D3',
                                            marginTop: 5,
                                            shadowColor: "#2CC8D4",
                                            shadowOffset: {
                                                width: 0,
                                                height: 0,
                                            },
                                            shadowOpacity: 0.6,
                                            shadowRadius: 6.27,
                                            elevation: 2,
                                            zIndex: 9999
                                        }} />
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => item.type}
                />
            </View >
        );
    }
}

const selectedBtn = (type) => StyleSheet.create({
    selected: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontWeight: type ? 'bold' : 'normal',
        // textDecorationLine: type ? 'underline' : 'none',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 42, // take 38% of the screen height
        backgroundColor: 'transparent',
        marginTop: 10,
    },
    text: {
        textAlign: 'center',
    },
    active: {
        fontWeight: 'bold',

    }
});