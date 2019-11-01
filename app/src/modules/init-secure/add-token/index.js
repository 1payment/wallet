import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Func_Add_Account } from '../../../../redux/rootActions/easyMode';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import FormCreate from './create'
import FormImport from './import'
import Header from '../../../components/header';
import BackgroundApp from '../../../components/background'

export default class Add_token extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type_add: this.props.navigation.getParam('payload').type_add
        };
        console.log(this.props.navigation.getParam('payload'))
    }

    render() {
        return (
            <BackgroundApp in_app={false}>
                <Header
                    IconLeft={"arrow-back"}
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Phrase"
                    styleTitle={{ color: "#fff" }}
                    colorIconLeft='#fff'
                    colorIconRight="#fff"
                />
                {
                    this.state.type_add == "create" ?
                        <FormCreate {...this.props} />
                        :
                        <FormImport {...this.props} />
                }
            </BackgroundApp>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})


