import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, ActivityIndicator, Image, StyleSheet, Alert, Platform } from 'react-native';

import pkg from '../../package.json';

//Components
import { Text, ProgressView } from '../components';

//Context
import { APPContext } from '../context/AppProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

// COLORS & IMAGES
import { COLORS } from '../../assets'

//PACKAGES
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

//fb sdk
import { Settings } from 'react-native-fbsdk-next';

export default function Splash(props) {
    const user = auth().currentUser;

    const [isLoading, setLoading] = useState(true)
    const { getSubscriptionDetails } = useContext(APPContext);
    const { getUserLanguage, setI18nConfig, getTranslation } = useContext(LocalizatiionContext);

    useEffect(async () => {
        Settings.setAppID('863515477696281');
        Settings.initializeSDK();
        getUserLanguage((res) => {
            setI18nConfig(res)
            checkAndUpdate()
            setLoading(false)
        })
    }, [])

    const checkAndUpdate = () => {
        AsyncStorage.getItem('is_first_time_install', (error, result) => {
            if (result) {
                if (user) {
                    updateUser()
                }
                else {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'SignIn' }
                            ],
                        })
                    );
                }
            }
            else {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'SelectLanguage', params: { isFromLogin: true } }
                        ],
                    })
                );
            }
        })
    }

    const updateUser = async () => {
        let user = auth().currentUser
        firestore()
            .collection('users')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    getSubscription()
                    firestore()
                        .collection('users')
                        .doc(user.email)
                        .update({
                            email: user.email,
                            firstName: user.displayName,
                            lastName: user.displayName,
                            dateUpdated: firestore.FieldValue.serverTimestamp(),
                            version: pkg.version,
                            platform: Platform.OS,
                        })
                        .then(() => {
                            registerDevice()
                        }).catch((error) => {
                            registerDevice()
                            console.log(error)
                        });
                }
                else {
                    firestore()
                        .collection('users')
                        .doc(user.email)
                        .set({
                            email: user.email,
                            firstName: user.displayName,
                            lastName: user.displayName,
                            dateAdded: firestore.FieldValue.serverTimestamp(),
                            dateUpdated: firestore.FieldValue.serverTimestamp(),
                            version: pkg.version,
                            platform: Platform.OS
                        })
                        .then(() => {
                            registerDevice()
                        }).catch((error) => {
                            registerDevice()
                            console.log(error)
                        });


                    var date = moment().add(8, 'days').format('YYYY-MM-DD')
                    firestore()
                        .collection('subscriber')
                        .doc(user.email)
                        .set({
                            productId: 'dojo_free_trial',
                            transactionDate: moment().milliseconds(),
                            transactionId: '',
                            transactionReceipt: '',
                            expiryDate: date,
                            email: user.email,
                            device: Platform.OS
                        })
                        .then(async () => {
                            getSubscription()
                            registerDevice()
                        }).catch((error) => {
                            console.log(error)
                            registerDevice()
                            getSubscription()
                        });
                }
            })
    }

    const getSubscription = () => {
        getSubscriptionDetails((finished) => {
            setTimeout(() => {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Home' }
                        ],
                    })
                );
            }, 1000);
        })
    }

    const registerDevice = async () => {
        messaging().setAutoInitEnabled(true)
        if (Platform.OS == 'ios') {
            setTimeout(() => {
                setupIOSNotification()
                subscribe()
            }, 1000);
        }
        else {
            setUpNotification();
        }
    }

    setUpNotification = async () => {
        const defaultAppMessaging = messaging();
        const token = await defaultAppMessaging.getToken();

        getFcmToken()

        if (!defaultAppMessaging.isDeviceRegisteredForRemoteMessages) {
            await defaultAppMessaging.registerDeviceForRemoteMessages();
        }

        if (Platform.OS == 'android') {
            defaultAppMessaging.onMessage(async (remoteMessage) => {
                console.log("## remote message", JSON.stringify(remoteMessage))
                console.log("## remote message", remoteMessage.messageId)

                PushNotification.createChannel(
                    {
                        channelId: remoteMessage.messageId, // (required)
                        channelName: `Custom channel - Counter: ${remoteMessage.messageId}`, // (required)
                        channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
                        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                        importance: 4, // (optional) default: 4. Int value of the Android notification importance
                        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                    },
                    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
                );

                let data;
                console.log(remoteMessage.hasOwnProperty('data'));
                if (remoteMessage.hasOwnProperty('data')) {
                    let notification = remoteMessage.data
                    data = { message: notification.noti_body, title: notification.noti_title, image: notification.noti_image_url };
                    console.log(data);
                } else {
                    data = remoteMessage.data
                }

                PushNotification.localNotification({
                    /* Android Only Properties */
                    // id: "0", // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                    priority: "high", // (optional) set notification priority, default: high
                    importance: 4, // (optional) set notification importance, default: high
                    /* iOS and Android properties */
                    title: data.title, // (optional)
                    message: data.message,// remoteMessage.data.message, // (required),
                    channelId: remoteMessage.messageId,
                    bigPictureUrl: data.image
                });
            })
        }
    }

    const subscribe = () => {
        // PushNotificationIOS.getInitialNotification().then((noti) => {
        //     if (noti) {
        //        navigation.navigate("Notifications");
        //     }
        // })

        // PushNotificationIOS.addEventListener('notification', (noti) => {
        //     console.log(noti)
        //     if (noti) {
        //         props.navigation.navigate("Notifications");
        //     }
        // })
    }

    const setupIOSNotification = async () => {
        if (messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages()
        }

        messaging().hasPermission().then(enable => {
            if (enable) {
                requestForNotification()
            }
            else {
                messaging().requestPermission().then(() => {
                    requestForNotification()
                }).catch(error => {
                    Alert.alert("Permission Denied", error.message, [{
                        text: getTranslation('ok'), onPress: () => {
                            
                        }
                    }])
                })
            }
        })
    }

    const requestForNotification = () => {
        PushNotificationIOS.requestPermissions().then((permission) => {
            if (permission.alert == 1) {
                getFcmToken()
            }
        })
    }

    const getFcmToken = () => {
        messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    firestore().collection('users').doc(user.email).update({
                        tokens: firestore.FieldValue.arrayUnion(fcmToken),
                        update_date: firestore.FieldValue.serverTimestamp(),
                    })
                }
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <ActivityIndicator
                style={{ alignSelf: 'center' }}
                size='large'
                animating={true}
                color={COLORS.orange} />
            {isLoading == false &&
                <Text
                    extraStyle={{ alignSelf: 'center', marginTop: 20 }}
                    size="14"
                    weight="400"
                    align='center'
                    color={COLORS.orange}>
                    {getTranslation('splash_message')}
                </Text>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        backgroundColor: COLORS.background,
        justifyContent: 'center'
    }
})