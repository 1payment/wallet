import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    Image
} from 'react-native'
import ImageApp from '../../../../../helpers/constant/image';
import Color from '../../../../../helpers/constant/color';
import Header from '../../../../components/header';
import CONSTANT from '../../../../../helpers/constant'
import BackgroundApp from '../../../../components/background'
import Settings from '../../../../../settings/initApp'


export default class SelectImport extends Component {

    toScreen = (type) => {
        const { token, typeAdd, loadData } = this.props.navigation.getParam('payload');
        this.props.navigation.navigate('ImportAccount', {
            payload: {
                token,
                type,
                typeAdd,
                loadData
            }
        })
    }
    render() {
        let ArrayButton = [
            {
                Title: 'Private key',
                Description: 'Scan or enter your private key to restore your wallet. Make sure to keep your private key safe after you are done',
                Type: 'privatekey',
                Icon: ImageApp.icon_private_key
            },
            {
                Title: 'Mnemonic',
                Description: 'Enter your Mnemonic Phrase to recover your wallet. Make sure to keep your Mnemonic Phrase safe after you are done',
                Type: 'mnemoric',
                Icon: ImageApp.icon_mnemonic
            },
            {
                Title: 'Select exist Account',
                Description: 'Scan or enter your wallet address to monitor it. This is a view only wallet and transaction cannot be sent without a Private key',
                Type: 'account',
                Icon: ImageApp.icon_address
            }
        ]
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title='Import account'
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <View style={styles.container}>
                    <FlatList
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        data={ArrayButton}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={styles.styleButton}
                                    onPress={() => this.toScreen(item.Type)}
                                >
                                    <View style={{ flex: 7 }}>
                                        <Text style={{
                                            color: '#535353',
                                            fontSize: 20,
                                            fontWeight: 'bold'
                                        }}>{item.Title}</Text>
                                        <Text
                                            style={{
                                                color: '#979797',
                                                fontSize: 13,
                                            }}
                                        >{item.Description}</Text>
                                    </View>
                                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={item.Icon}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </BackgroundApp>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    styleButton: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#F8F9F9',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.27,
        elevation: 3,
        flexDirection: 'row',
        margin: Platform.OS == 'android' ? 5 : 1,
        paddingVertical: 8,
    }
})
