import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { View } from 'react-native'
import InitApp from './Init-app';
import InApp from './router-app';
import InitSecure from './router-create-secure';
export default class RootRouter extends Component {

    render() {
        let RouterContainer = createSwitchNavigator(
            {
                InitApp,
                InApp,
                InitSecure
            },
            {
                initialRouteName: 'InitApp',
            }
        )

        return (
            <View style={{ backgroundColor: 'red', flex: 1 }} >
                <RouterContainer />
            </View>
        );
    }
}
