import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Color from '../../../../helpers/constant/color';
import ImageApp from '../../../../helpers/constant/image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import SlideShow from '../../../components/slide-show';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import BackgroundApp from '../../../components/background';
import { getBottomSpace } from 'react-native-iphone-x-helper'

const slides = [
    {
        key: 'somethun',
        title: 'Secure',
        text: 'Private keys never leave your device \nSecure your every transaction with verification',
        image: '',
        backgroundColor: 'transparent',
    },
    {
        key: 'somethun-dos',
        title: 'Private',
        text: 'Store your private keys safely in a local isolated secure vault on your device',
        image: '',
        backgroundColor: 'transparent',
    },
    {
        key: 'somethun1',
        title: 'No centralized',
        text: 'No centralized servers for communication',
        image: '',
        backgroundColor: 'transparent',
    }
];

export default class Type_create extends Component {

    // componentDidMount() {
    //     this.goToChangePassword('create')
    // }

    goToChangePassword = (type) => {
        this.props.navigation.navigate('UpdatePassword', { payload: { type_add: type } })
    }

    render() {
        return (
            // <BackgroundApp in_app={false}>
            //     <View style={styles.container}>
            //         <View style={{ flex: 8 }}>
            //             <SlideShow
            //                 slides={slides}
            //                 nextLabel=""
            //                 doneLabel=""
            //                 // renderItem={this._render_item}
            //                 paginationStyle={{ bottom: 0 }}
            //             />
            //         </View>


            //         <View style={{ flex: 2, justifyContent: 'center', }}>
            //             <View style={{ paddingHorizontal: wp('20%') }}>
            //                 <TouchableOpacity
            //                     onPress={() => this.goToChangePassword('create')}
            //                 >
            //                     <View style={[styles.buttonStyle, { backgroundColor: '#fff' }]}>
            //                         <Text style={{ color: Color.Tomato, fontSize: font_size('2.5') }}>Create a new wallet</Text>
            //                     </View>
            //                 </TouchableOpacity>
            //             </View>
            //             <TouchableOpacity
            //                 style={styles.buttonStyle}
            //                 onPress={() => this.goToChangePassword('import')}
            //             >

            //                 <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>I already have a wallet</Text>
            //             </TouchableOpacity>
            //         </View>
            //     </View>
            // </BackgroundApp>
            <SlideImage
                onPress={this.goToChangePassword.bind(this)}
            />
        );
    }
}

const styleItem = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getStatusBarHeight(),
        flexDirection: 'column'
    },
    Title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Image: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Content: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonStyle: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 7,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})



import PropsTypes from 'prop-types';

const { height, width } = Dimensions.get('window')
interface SlideProps {
    data: Array,
    onPress: Function
}

class SlideImage extends Component<SlideProps> {
    static PropsTypes = {
        data: PropsTypes.array,
        onPress: PropsTypes.func
    }

    static defaultProps = {
        data: [
            {
                image: ImageApp.slide1,
                title: '',
                content: ''
            },
            {
                image: ImageApp.slide2,
                title: '',
                content: ''
            },
            {
                image: ImageApp.slide3,
                title: '',
                content: ''
            },
        ]
    }

    _render_Item = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                {
                    item.image.uri && item.image.uri.length > 0 ?
                        <Image source={item.image.uri} style={{ height, width }} resizeMode="cover" />
                        :
                        <Image source={item.image} style={{ height, width }} resizeMode="cover" />
                }
            </View>
        )
    }

    render() {
        const {
            data,
            onPress
        } = this.props;

        return (
            <View >
                <FlatList
                    data={data}
                    renderItem={this._render_Item}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={{
                    justifyContent: 'center',
                    position: "absolute",
                    bottom: getBottomSpace(),
                    left: 0
                }}>
                    <View style={{ paddingHorizontal: wp('20%') }}>
                        <TouchableOpacity
                            onPress={() => onPress('create')}
                        >
                            <Gradient
                                colors={Color.Gradient_button_tomato}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.buttonStyle]}
                            >
                                <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Create a new wallet</Text>
                            </Gradient>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => onPress('import')}
                    >

                        <Text style={{ color: Color.Tomato, fontSize: font_size('2.5') }}>I already have a wallet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}