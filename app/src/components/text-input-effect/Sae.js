import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wd, responsiveFontSize as fontS } from '../../../helpers/constant/responsive'
import BaseInput from './BaseInput';

interface PropsInput {
    height?: number,
    borderHeight: number,
    iconClass: Function,
    iconName: string,
    iconColor: string,
    inputPadding: number,
    labelHeight: number,
    showBorderBottom: boolean
}

export default class Sae extends BaseInput<PropsInput> {
    static propTypes = {
        height: PropTypes.number,
        /*
         * active border height
         */
        borderHeight: PropTypes.number,
        /*
         * This is the icon component you are importing from react-native-vector-icons.
         * import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
         * iconClass={FontAwesomeIcon}
         */
        iconClass: PropTypes.func.isRequired,
        /*
         * Passed to react-native-vector-icons library as name prop
         */
        iconName: PropTypes.string,
        /*
         * Passed to react-native-vector-icons library as color prop.
         * This is also used as border color.
         */
        iconColor: PropTypes.string,
        inputPadding: PropTypes.number,
        labelHeight: PropTypes.number,
        showBorderBottom: PropTypes.bool
    };

    static defaultProps = {
        iconColor: 'white',
        height: hp('7%'),
        inputPadding: hp('0%'),
        labelHeight: hp('5%'),
        borderHeight: 1,
        animationDuration: 250,
        iconName: 'pencil',
        showBorderBottom: true
    };

    render() {
        const {
            iconClass,
            iconColor,
            iconName,
            label,
            style: containerStyle,
            height: inputHeight,
            inputPadding,
            labelHeight,
            borderHeight,
            inputStyle,
            labelStyle,
            showBorderBottom
        } = this.props;
        const { width, focusedAnim, value } = this.state;
        const AnimatedIcon = Animated.createAnimatedComponent(iconClass);

        return (
            <View
                // onTouchStart={e => console.log(e.nativeEvent.locationY, e.nativeEvent.pageY)}
                style={[
                    styles.container,
                    containerStyle,
                    {
                        minHeight: inputHeight,
                    },
                ]}
                onLayout={this._onLayout}
            >
                <TouchableWithoutFeedback onPress={this.focus}>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            bottom: focusedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, labelHeight + inputPadding],
                            }),
                        }}
                    >
                        <Animated.Text
                            style={[
                                styles.label,
                                labelStyle,
                                {
                                    fontSize: focusedAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [18, 12],
                                    }),
                                },
                            ]}
                        >
                            {label}
                        </Animated.Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <TextInput
                    ref={this.input}
                    {...this.props}
                    style={[
                        styles.textInput,
                        inputStyle,
                        {
                            width,
                            height: inputHeight,
                            paddingTop: inputPadding / 2,
                        },
                    ]}
                    value={value}
                    onBlur={this._onBlur}
                    onChange={this._onChange}
                    onFocus={this._onFocus}
                    underlineColorAndroid={'transparent'}
                />
                {
                    showBorderBottom ?
                        <TouchableWithoutFeedback onPress={this.focus}>
                            <AnimatedIcon
                                name={iconName}
                                color={iconColor}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: focusedAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, width + inputPadding],
                                    }),
                                    transform: [
                                        {
                                            rotate: focusedAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '-90deg'],
                                            }),
                                        },
                                    ],
                                    fontSize: 20,
                                    backgroundColor: 'transparent',
                                }}
                            />
                        </TouchableWithoutFeedback>
                        :
                        null
                }
                {/* bottom border */}
                {
                    showBorderBottom ?
                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                height: borderHeight,
                                width: focusedAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, width],
                                }),
                                backgroundColor: iconColor,
                            }}
                        />
                        :
                        null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    label: {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        color: '#7771ab',
    },
    textInput: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingLeft: 0,
        color: 'white',
        fontSize: 18,
    },
});
