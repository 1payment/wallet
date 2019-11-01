import React, { Component } from 'react'
import {
    Animated,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Platform,
    ViewProps,
    View
} from 'react-native'
import PropTypes from 'prop-types'
import LayoutUtils from './LayoutUtils'
// import GLOBAL from '../../helper/variables';
import Color from '../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import CONSTANT from '../../../helpers/constant';
import Settings from '../../../settings/initApp'


const isIPX = LayoutUtils.getIsIPX()
const extraBottom = LayoutUtils.getExtraBottom()

interface BottomButtomProps extends ViewProps {
    onPress: Function,
    text: String,
    disable: Boolean
}

export default class BottomButton extends Component<BottomButtomProps> {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        text: PropTypes.string,
        disable: PropTypes.bool
    }

    static defaultProps = {
        text: 'DONE',
        disable: false
    }

    state = {
        bottom: new Animated.Value(20 + extraBottom),
        marginVertical: new Animated.Value(20),
        borderRadius: new Animated.Value(5)
    }

    componentWillMount() {
        const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
        const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
        this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
        this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
    }

    componentDidMount() {
        this.isPress = false
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    onPress = () => {
        if (this.isPress) {
            return
        }
        this.isPress = true
        const { onPress } = this.props
        Keyboard.dismiss()
        setTimeout(() => { this.isPress = false }, 500)
        onPress()
    }

    _runKeyboardAnim(toValue) {
        const duration = Platform.OS === 'ios' ? 250 : 0
        Animated.parallel([
            Animated.timing(
                this.state.bottom,
                {
                    toValue,
                    duration
                }
            ),
            Animated.timing(
                this.state.marginVertical,
                {
                    toValue: toValue === 20 + extraBottom ? 20 : 0,
                    duration
                }
            ),
            Animated.timing(
                this.state.borderRadius,
                {
                    toValue: toValue === 20 + extraBottom ? 5 : 0,
                    duration
                }
            )
        ]).start()
    }

    _keyboardDidShow(e) {
        let value = Platform.OS === 'ios' ? e.endCoordinates.height + extraBottom - 55 : 0

        if (isIPX) {
            value -= 34
        }
        this._runKeyboardAnim(value)
    }

    _keyboardDidHide(e) {
        this._runKeyboardAnim(20 + extraBottom)
    }

    render() {
        const { text, disable } = this.props
        return (
            <Animated.View style={{
                position: 'absolute',
                bottom: this.state.bottom,
                marginTop: 10,
                borderRadius: this.state.borderRadius,
                // backgroundColor: 'red',
                left: this.state.marginVertical,
                right: this.state.marginVertical
            }}
            >
                {
                    Settings.mode_secure ?
                        <TouchableOpacity
                            disabled={disable}
                            onPress={this.onPress}
                        >
                            <View
                                style={[styles.saveButton, { backgroundColor: disable ? '#d1d1d1' : '#fff' }]}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: disable ? Color.Dark_gray : Color.Tomato,
                                    fontWeight: '400'
                                }}>
                                    {text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            disabled={disable}
                            onPress={this.onPress}
                        >
                            <Gradient
                                colors={disable ? Color.Gradient_gray_switch : Color.Gradient_button_tomato}
                                style={styles.saveButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: disable ? Color.Dark_gray : '#fff',
                                    fontWeight: '400'
                                }}>
                                    {text}
                                </Text>
                            </Gradient>
                        </TouchableOpacity>
                }

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    saveButton: {
        paddingVertical: 13,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
