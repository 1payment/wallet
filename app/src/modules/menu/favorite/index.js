import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Header from '../../../components/header';
import ImageApp from '../../../../helpers/constant/image';
import Color from '../../../../helpers/constant/color';
import Gradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive'
import { insert_favorite, get_all_favorite, name_favorite, update_object_favotire, delete_favorite } from '../../../../db'
import ActionSheet from '../../../components/action-sheet'
import Dialog from "react-native-dialog";
import FlashMessage, { showMessage } from '../../../../lib/flash-message'
import BackgroundApp from '../../../components/background'
import Settings from '../../../../settings/initApp'


export default class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_Favorite: [],
            favorite: {},
            dialogSend: false,
            newName: ''
        };
    }

    componentWillMount() {
        this.getData()
    }

    getData = () => {
        get_all_favorite().then(data => {
            this.setState({ list_Favorite: JSON.parse(JSON.stringify(data)) })
        })
    }

    chooseAddress = (item) => {
        this.setState({ favorite: item, newName: item.name }, () => {
            this.ActionSheet.show();
        })
    }

    handleCancel = () => {
        this.setState({ dialogSend: false })
    }

    handleOk = () => {
        var object_favotire = {
            id: this.state.favorite.id,
            name: this.state.newName,
            address: this.state.favorite.address
        }
        update_object_favotire(object_favotire).then(ss => {
            this.setState({ dialogSend: false }, () => {
                showMessage({
                    message: 'Change name success',
                    type: 'success',
                    animated: true,
                    icon: "success",
                });
                this.getData()
            })
        }).catch(err => console.log(err))
    }

    delete_Favorite = () => {
        delete_favorite(this.state.favorite.id).then(ss => {
            showMessage({
                message: 'Remove favorite success',
                type: 'success',
                animated: true,
                icon: "success",
            });
            this.getData()
        }).catch(err => console.log(err))
    }

    onPressAction = (index) => {
        switch (index) {
            case 0:
                setTimeout(() => {
                    this.setState({ dialogSend: true })
                }, 350);
                break;
            case 1:
                this.delete_Favorite()
                break
            default:
                break;
        }
    }

    render() {
        return (
            <BackgroundApp>
                <Header
                    IconLeft="arrow-back"
                    onPressLeft={() => this.props.navigation.goBack()}
                    Title="Favorite"
                    styleTitle={{ color: Color.Tomato }}
                    styleTitle={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}
                    colorIconLeft={Settings.mode_secure ? '#fff' : Color.Tomato}
                    colorIconRight={Settings.mode_secure ? '#fff' : Color.Tomato}
                />
                <FlashMessage position="top" />
                <View style={{ flex: 1, padding: hp('1') }}>
                    {
                        this.state.list_Favorite.length > 0 ?
                            <View>
                                <FlatList
                                    data={this.state.list_Favorite}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    // borderBottomWidth: 1,
                                                    // borderBottomColor: Color.Light_gray,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 10,
                                                    marginVertical: hp('1')
                                                }}
                                                onPress={() => this.chooseAddress(item)}
                                            >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View
                                                            style={{
                                                                height: wp('10'),
                                                                width: wp('10'),
                                                                borderWidth: 1,
                                                                borderRadius: wp('10')
                                                            }} />
                                                    </View>
                                                    <View style={{ flex: 8.5, paddingRight: wp('1') }}>
                                                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                        <Text numberOfLines={1} ellipsizeMode="middle" style={{ color: Color.Dark_gray }}>{item.address}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                <View>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: hp('2'),
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            marginVertical: hp('1')
                                        }}
                                        onPress={() => this.props.navigation.navigate('AddFavorite', {
                                            payload: {
                                                reloadData: this.getData
                                            }
                                        })}
                                    >
                                        <View style={{ justifyContent: 'center', marginHorizontal: wp('2') }}>
                                            <Icon name="plus-circle-outline" size={font_size(3)} color={Settings.mode_secure ? '#fff' : Color.Tomato} />
                                        </View>
                                        <View style={{ justifyContent: 'center', marginHorizontal: wp('2') }}>
                                            <Text style={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}>Add new favorite</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View>
                                <View>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: hp('2'),
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            marginVertical: hp('1')
                                        }}
                                        onPress={() => this.props.navigation.navigate('AddFavorite', {
                                            payload: {
                                                reloadData: this.getData
                                            }
                                        })}
                                    >
                                        <View style={{ justifyContent: 'center', marginHorizontal: wp('2') }}>
                                            <Icon name="plus-circle-outline" size={font_size(3)} color={Settings.mode_secure ? '#fff' : Color.Tomato} />
                                        </View>
                                        <View style={{ justifyContent: 'center', marginHorizontal: wp('2') }}>
                                            <Text style={{ color: Settings.mode_secure ? '#fff' : Color.Tomato }}>Add new favorite</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={this.state.favorite.name}
                    options={['Change name', 'Remove', 'cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => this.onPressAction(index)}
                />

                <Dialog.Container visible={this.state.dialogSend} >
                    <Dialog.Title>Enter new name</Dialog.Title>
                    <Dialog.Description>
                        Enter new name to change name
                    </Dialog.Description>
                    <Dialog.Input
                        placeholder="New name"
                        onChangeText={(val) => this.setState({ newName: val })}
                        autoFocus={true}
                        value={this.state.newName}
                    />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel.bind(this)} />
                    <Dialog.Button label="Ok" onPress={this.handleOk.bind(this)} />
                </Dialog.Container>
            </BackgroundApp>
        );
    }
}

const styles = StyleSheet.create({

})
