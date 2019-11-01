import React, { Component } from 'react';
import { Text, View, ImageBackground } from 'react-native';
import PropTypes from "prop-types";
import Settings from '../../../settings/initApp';
import ImageApp from '../../../helpers/constant/image';
import Color from '../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient'

interface BackgroundAppProps {
    in_app: boolean
}


class BackgroundApp extends Component<BackgroundAppProps> {
    static propTypes = {
        children: PropTypes.node,
        in_app: PropTypes.bool
    }

    static defaultProps = {
        children: <View />,
        in_app: true
    }


    render() {
        const { children, in_app } = this.props;
        if (Settings.mode_secure) {
            return (
                <ImageBackground
                    source={ImageApp.bg_app}
                    style={{ flex: 1, paddingBottom: in_app ? 50 : 0 }}
                >
                    {children}
                </ImageBackground>
            )
        } else {
            return (
                <Gradient
                    colors={Color.Gradient_backgound_page}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, paddingBottom: in_app ? 50 : 0 }}
                >
                    {children}
                </Gradient>
            )
        }
    }
}

export default BackgroundApp;


