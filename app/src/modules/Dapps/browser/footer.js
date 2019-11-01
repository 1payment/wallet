import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import Color from '../../../../helpers/constant/color';


export default class Footer extends Component {
    render() {
        const {
            goBack,
            goForward,
            reFresh
        } = this.props
        return (
            <View
                style={{
                    width: wp('100'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: hp('1.5'),
                    // marginBottom: 50
                }}
            >
                <TouchableOpacity
                    onPress={goBack}
                    style={{ flex: 1 }}
                >
                    <Icon name="chevron-left"
                        style={{ textAlign: 'center', color: Color.Cadet_blue, fontWeight: 'bold' }}
                        size={25} />
                </TouchableOpacity>
                <View style={{ flex: 8, justifyContent: 'center' }} >
                    <TouchableOpacity
                        onPress={reFresh}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <Icon name="redo"
                            style={{ textAlign: 'center', color: Color.Cadet_blue, fontWeight: 'bold' }}
                            size={25} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={goForward}
                    style={{ flex: 1 }}
                >
                    <Icon name="chevron-right"
                        style={{ textAlign: 'center', color: Color.Cadet_blue, fontWeight: 'bold' }}
                        size={25} />
                </TouchableOpacity>

            </View>
        )
    }
}
