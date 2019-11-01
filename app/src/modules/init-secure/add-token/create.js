import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';
import { Create_phrase, random_phrase } from './add-token.service'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Button from '../../../components/button'


export default class create extends Component {
    state = {
        wordlist: []
    }
    componentWillMount() {
        Create_phrase().then(wordlist => {
            this.wordlistString = wordlist;
            this.wordlist_true = wordlist.split(" ")
            this.setState({ wordlist: wordlist.split(" ") })
        }).catch(e => console.log(e))
        console.log('aaa', this.props.navigation.getParam('payload'))
    }

    _render_item = ({ item, index }) => {
        return (
            <View style={styleItem.container}>
                <Text style={{ color: Color.Tomato }}>{index + 1}. </Text>
                <Text style={{ color: Color.Tomato }}>{item}</Text>
            </View>
        )
    }

    goToLoading = () => {
        const { type_add, item, pwd_en } = this.props.navigation.getParam('payload')
        let temp_wordlist = this.wordlist_true.concat('');
        temp_wordlist.pop()
        random_phrase(temp_wordlist).then(random_wordlist => {
            this.props.navigation.navigate('LoadingCreate', {
                payload: {
                    random_wordlist: random_wordlist,
                    wordlist: this.wordlist_true,
                    wordlist_string: this.wordlistString,
                    type_add,
                    item,
                    pwd_en
                }
            })
        }).catch(e => console.log(e))
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}> Your recovery phrase </Text>
                    <Text style={styles.content}>Write down or copy these words in the right order and save them somewhere safe.</Text>
                </View>
                <View style={styles.form}>
                    {
                        this.state.wordlist.length > 0 &&
                        <FlatList
                            data={this.state.wordlist}
                            renderItem={this._render_item}
                            keyExtractor={(index, item) => index.toString()}
                            style={styles.formPhrase}
                            contentContainerStyle={{ padding: hp('1') }}
                            numColumns={4}
                            horizontal={false}
                        // columnWrapperStyle={{ marginTop: 10 }}
                        />
                    }
                </View>
                <View style={styles.formCaution}>
                    <Icon name="alert-outline" color="#fff" style={{ textAlign: 'center' }} size={font_size(5)} />
                    <Text style={styles.content}>Never share recovery phrase with anyone, store it securely!</Text>
                </View>
                <View style={styles.formButton}>
                    {/* <TouchableOpacity
                        onPress={this.goToLoading}
                    >
                        <Gradient
                            colors={Color.Gradient_button_tomato}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.styleButton}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontSize: font_size('2.5') }}>Next</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <Icon name="arrow-right" size={font_size(3.5)} color="#fff" />
                            </View>
                        </Gradient>
                    </TouchableOpacity> */}
                    <Button
                        onpress={this.goToLoading.bind(this)}
                        title="Next"
                    />
                </View>
            </View>
        )
    }
}

const styleItem = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Color.Tomato,
        flexDirection: 'row',
        padding: 5,
        borderRadius: 4,
        margin: 5,
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: hp('2'),
        // flexDirection: 'column',
    },
    form: {
        marginVertical: hp('3')
    },
    title: {
        textAlign: 'center',
        fontSize: font_size('3'),
        fontWeight: 'bold',
        color: '#fff'
    },
    content: {
        textAlign: 'center',
        color: '#fff',
        fontStyle: 'italic'
    },
    formPhrase: {
        backgroundColor: "#fff",
        borderRadius: 15,

    },
    formCaution: {
        backgroundColor: 'rgba(255, 255, 255, 0.17)',
        borderRadius: 15,
        marginTop: hp('3'),
        padding: hp('1')
    },
    styleButton: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1.3%'),
        borderRadius: hp('1.3'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formButton: {
        padding: wp('20'),
    }
})
