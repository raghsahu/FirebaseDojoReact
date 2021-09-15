import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

//Components
import { Header, Text, BookItem } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { EventRegister } from 'react-native-event-listeners'

export default function Menu({ navigation, onPressItem }) {
    const user = auth().currentUser;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Text
                extraStyle={{ marginTop: 20, marginLeft: 20 }}
                size="22"
                weight="600"
                color={COLORS.black}>
                {'Welcome to'}
                <Text
                    extraStyle={{ marginTop: 40 }}
                    size="22"
                    weight="600"
                    color={COLORS.orange}>
                    {' Dojo'}
                </Text>
            </Text>
            <View style={styles.devider} />
            <View style={styles.profileView}>
                <Image style={styles.profileIcon} source={IMAGES.ic_settings} />
                <Text
                    extraStyle={{ marginLeft: 10 }}
                    size="20"
                    weight="600"
                    color={COLORS.black}>
                    {'Profile Settings'}
                </Text>
            </View>
            <View style={{ height: 20 }} />
            <Text
                onPress={() => {
                    onPressItem('edit')
                }}
                extraStyle={{ marginLeft: 20, marginBottom: 10 }}
                size="18"
                weight="400"
                color={COLORS.black}>
                {'Edit Profile'}
            </Text>
            <View style={styles.singleDevider} />
            <Text
                onPress={() => {
                    onPressItem('subscription')
                }}
                extraStyle={{ marginLeft: 20, marginTop: 10 }}
                size="18"
                weight="400"
                color={COLORS.black}>
                {'My Subscription'}
            </Text>
            <View style={styles.devider} />
            <TouchableOpacity style={styles.profileView}
                onPress={() => {
                    onPressItem('refer_friend')
                }}>
                <Image style={styles.profileIcon} source={IMAGES.ic_redeem} />
                <Text
                    extraStyle={{ marginLeft: 10 }}
                    size="20"
                    weight="600"
                    color={COLORS.black}>
                    {'Refer a Friend'}
                </Text>
            </TouchableOpacity>
            <View style={styles.devider} />
            <TouchableOpacity style={styles.profileView}
                onPress={() => {
                    onPressItem('my_review')
                }}>
                <Image style={styles.profileIcon} source={IMAGES.ic_referal} />
                <Text
                    extraStyle={{ marginLeft: 10 }}
                    size="20"
                    weight="600"
                    color={COLORS.black}>
                    {'My Reviews'}
                </Text>
            </TouchableOpacity>
            <View style={styles.devider} />
            <TouchableOpacity style={styles.profileView} onPress={() => {
                Alert.alert('', 'Are you sure to logout?', [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            auth().signOut()
                        }
                    }
                ])
            }}>
                <Image style={styles.profileIcon} source={IMAGES.ic_logout} />
                <Text
                    extraStyle={{ marginLeft: 10 }}
                    size="20"
                    weight="600"
                    color={COLORS.black}>
                    {'Logout'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    devider: {
        backgroundColor: '#e5e5e5',
        height: 5,
        marginVertical: 20
    },
    profileView: {
        flexDirection: 'row'
    },
    profileIcon: {
        height: 25,
        width: 25,
        marginLeft: 20,
        alignSelf: 'center'
    },
    singleDevider: {
        backgroundColor: '#e5e5e5',
        height: 1,
        marginVertical: 5,
        marginLeft: 20
    },
})
