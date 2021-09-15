import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

import pkg from '../../package.json';

//Components
import { Text, ProgressView } from '../components';

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';


// COLORS & IMAGES
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import moment from 'moment';

export default function Signin(props) {

    let [isLoading, setLoading] = useState(false);

    const { mixPanelSignin } = useContext(AnalyticsContext);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '315915655813-mmjmv3rqem2so7huqpj2hmn9uacopsbq.apps.googleusercontent.com',
            offlineAccess: false,
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        });
    }, []);

    const onPressGoogleLogin = async () => {
        try {
            const { idToken } = await GoogleSignin.signIn();
            setLoading(true);
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);
            let user = auth().currentUser
            mixPanelSignin(user)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Image
                style={styles.image}
                source={IMAGES.login_img}
                resizeMode='contain'
            />
            <View style={styles.mainContainer}>
                <Text
                    extraStyle={{ marginTop: 40 }}
                    size="22"
                    weight="600"
                    align='center'
                    color={COLORS.black}>
                    {'Welcome to'}
                    <Text
                        extraStyle={{ marginTop: 40 }}
                        size="22"
                        weight="600"
                        align='center'
                        color={COLORS.orange}>
                        {' Dojo'}
                    </Text>
                </Text>
                <Text
                    extraStyle={{ marginTop: 15 }}
                    size="18"
                    weight="400"
                    align='center'
                    color={COLORS.darkGray}>
                    {'Are you ready to read our amazing\ninfographic collections?'}
                </Text>
                <TouchableOpacity style={styles.googleButton} onPress={() => onPressGoogleLogin()}>
                    <Image
                        style={styles.googleIcon}
                        source={IMAGES.ic_google}
                    />
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="18"
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {'SIGN UP WITH GOOGLE'}
                    </Text>
                </TouchableOpacity>
            </View>
            {isLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        backgroundColor: COLORS.background
    },
    image: {
        marginTop: 20,
        alignSelf: 'center'
    },
    googleButton: {
        flexDirection: 'row',
        height: 45,
        marginTop: 30,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        marginHorizontal: 30,
        borderRadius: 5,
        justifyContent: 'center'
    },
    googleIcon: {
        height: 25,
        width: 25,
        aspectRatio: 1,
        marginRight: 20,
        alignSelf: 'center'
    }
})
