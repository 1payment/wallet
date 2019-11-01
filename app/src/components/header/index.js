import React, { Component } from 'react';
import { Text, View, ViewProps, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import PropsTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from '../../../helpers/constant/color'
import Settings from '../../../settings/initApp';


export interface HeaderProps {
    componentLeft: Function, //* return component left - default null
    componentRight: Function, //* return component right - default null
    Title?: string,
    styleTitle: any,
    onPressLeft?: Function, // use when props componentLeft null
    onPressRight?: Function, // use when props componentRight null
    IconLeft?: string, // use when props componentLeft null
    IconRight?: string, // use when props componentRight null,
    colorIconLeft?: string,
    colorIconRight?: string,
    componentTitle?: Function
}
const statusBarHeight = getStatusBarHeight();

export default class HeaderApp extends Component<HeaderProps> {
    static PropsTypes = {
        componentLeft: PropsTypes.func,
        componentRight: PropsTypes.func,
        Title: PropsTypes.string,
        componentTitle: PropsTypes.func,
        styleTitle: PropsTypes.any,
        onPressLeft: PropsTypes.func,
        onPressRight: PropsTypes.func,
        IconLeft: PropsTypes.string,
        IconRight: PropsTypes.string,
        colorIconLeft: PropsTypes.string,
        colorIconRight: PropsTypes.string
    }

    static defaultProps = {
        componentLeft: () => null,
        componentRight: () => null,
        componentTitle: () => null,
        colorIconLeft: Color.Tomato,
        colorIconRight: Color.Tomato
    }

    // componentDidMount() {
    //     alert(statusBarHeight)
    // }
    render() {
        const {
            componentLeft,
            componentRight,
            Title,
            styleTitle,
            onPressLeft,
            onPressRight,
            IconLeft,
            IconRight,
            componentTitle,
            colorIconLeft,
            colorIconRight
        } = this.props;
        if (componentLeft() === null) {
            return (
                <View style={[styles.container]}>
                    <View style={{ flex: 2, justifyContent: 'center', }}>
                        {
                            IconLeft !== undefined &&
                            <TouchableOpacity
                                onPress={() => onPressLeft()}
                            >
                                <View style={{ flexDirection: 'row', paddingLeft: 3 }}>
                                    <Icon name={Platform.OS == 'ios' ? `ios-${IconLeft}` : `md-${IconLeft}`} size={30} color={colorIconLeft} />
                                    {Platform.OS == 'ios' &&
                                        <View style={{ justifyContent: 'center', marginBottom: 2, marginLeft: 3 }}>
                                            <Text style={{ color: colorIconLeft }}>Back</Text>
                                        </View>
                                    }
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[{ fontWeight: 'bold', fontSize: 15 }, styleTitle]}>{Title}</Text>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            IconRight !== undefined &&
                            <TouchableOpacity
                                onPress={() => onPressRight()}
                            >
                                <View style={{ justifyContent: 'center', paddingRight: 3 }}>
                                    <Icon name={Platform.OS == 'ios' ? `ios-${IconRight}` : `md-${IconRight}`} color={colorIconRight} size={30} />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[styles.container]}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        {componentLeft()}
                    </View>
                    <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Text style={[{ fontWeight: 'bold', fontSize: 15, }, styleTitle]}>{Title}</Text> */}
                        {componentTitle()}
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        {componentRight()}
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: statusBarHeight,
        flexDirection: 'row',
        padding: 5,
    }
})