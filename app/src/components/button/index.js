import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Settings from '../../../settings/initApp';
import Color from '../../../helpers/constant/color';
import PropsTypes from 'prop-types';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../helpers/constant/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export interface ButtonProps {
    title?: String,
    onpress?: Function,
    disable?: Boolean,
    icon?: String
}

export default class Button extends Component<ButtonProps> {

    static PropsTypes = {
        title: PropsTypes.string,
        onpress: PropsTypes.func,
        disable: PropsTypes.bool,
        icon: PropsTypes.string
    }

    static defaultProps = {
        title: 'Next',
        onpress: () => null,
        disable: false,
        icon: 'arrow-right'
    }


    render() {
        const {
            title,
            onpress,
            disable,
            icon,
        } = this.props

        if (Settings.mode_secure) {
            return (
                <TouchableOpacity
                    onPress={onpress}
                    disabled={disable}
                    style={styles.container}
                >
                    <View style={[styles.styleView, { backgroundColor: disable ? '#d1d1d1' : '#fff' }]}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ color: Color.Tomato, fontSize: font_size('2.5') }}>{title}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Icon name={icon} size={font_size(3.5)} color={Color.Tomato} />
                        </View>
                    </View>
                </TouchableOpacity>
            )

        } else {
            return (
                <TouchableOpacity
                    onPress={onpress}
                    disabled={disable}
                    style={styles.container}
                >
                    <Gradient
                        colors={disable ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.styleGradient}
                    >
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>{title}</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Icon name={icon} size={font_size(3.5)} color="#fff" />
                        </View>
                    </Gradient>
                </TouchableOpacity>
            )

        }
    }
}

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 5
        },
        shadowOpacity: 0.24,
        shadowRadius: 1.5,
        elevation: 2,
    },
    styleView: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    styleGradient: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})
