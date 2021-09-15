import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Rating } from 'react-native-ratings';
import { EventRegister } from 'react-native-event-listeners'

export default function NotificationDetails({ route, navigation }) {
    const item = route.params.item
    const user = auth().currentUser;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header title='Notification' onBack={() => navigation.goBack()} />
            <View style={styles.imageView}>
                {item && item.image &&
                    <View style={styles.image}>
                        <Image style={{
                            flex: 1.0, borderRadius: 10, overflow: 'hidden'
                        }}
                            resizeMode='cover'
                            source={item.image ? { uri: item.image } : null} />
                    </View>
                }
            </View>
            <View style={styles.viewMain}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                        extraStyle={{ marginLeft: 10, marginRight: 40, marginTop: 30 }}
                        size="17"
                        weight="600"
                        color={COLORS.darkGray}>
                        {item.title}
                    </Text>
                    <Text
                        extraStyle={{ marginHorizontal: 10, marginTop: 5 }}
                        size="13"
                        weight="400"
                        color={COLORS.darkGray}>
                        {item.description}
                    </Text>
                </ScrollView>
                <TouchableOpacity style={styles.subscribeButton}
                    onPress={() => {
                        onPressRead()
                    }}>
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="17"
                        weight="600"
                        align='center'
                        color={COLORS.white}>
                        {'READ'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageView: {
        width: '100%',
        aspectRatio: 1.2,
        backgroundColor: COLORS.background,
        marginBottom: 20
    },
    image: {
        height: '100%',
        width: '60%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        borderRadius: 10,
        marginVertical: 4
    },
    viewMain: {
        flex: 1.0,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: -5, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    likeButton: {
        height: 40,
        width: 40,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginTop: 10
    },
    likeImage: {
        height: 20,
        width: 20,
        alignSelf: 'center'
    },
    subscribeButton: {
        width: '80%',
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    subscribeModalButton: {
        width: '85%',
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    }
})