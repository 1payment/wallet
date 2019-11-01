import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import Header from '../../../../components/header';
import ImageApp from '../../../../../helpers/constant/image';
import Color from '../../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP } from '../../../../../helpers/constant/responsive';


export default class TypeNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Gradient
                colors={Color.Gradient_backgound_page}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
            >
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Advanced settings"
                    styleTitle={{ color: Color.Tomato }}
                />
                <View style={styles.container}>
                </View>
            </Gradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('1'),
    }
})