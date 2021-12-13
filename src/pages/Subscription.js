import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Alert, Platform, NativeModules } from 'react-native';

//Components
import { Header, ProgressView, Text } from '../components'

//Context
import { APPContext } from '../context/AppProvider';
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as RNIap from 'react-native-iap';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

export default function Subscription({ navigation }) {
    const user = auth().currentUser;

    const { getSubscriptionDetails } = useContext(APPContext);
    const { mixPanelOnSubscribe, mixPanelOnClickPurchase, mixPanelOnSubscriptionComplete } = useContext(AnalyticsContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    const [isMonthly, setMonthly] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const [isSubscriptionLoading, setSubscriptionLoading] = useState(false)
    const [isAlert, setAlert] = useState(false)

    useEffect(async () => {
        mixPanelOnSubscribe({ "email": user.email })
        await RNIap.initConnection();
     
        var purchaseUpdatedListener = RNIap.purchaseUpdatedListener((purchase) => {
            console.log("purchaseUpdatedListener", purchase)
            if (Platform.OS == 'ios') {
                vaidateReceiptIOS(purchase)
            }
            else if (Platform.OS == 'android') {
                validateReceiptANDROID(purchase)
            }
        })

        var purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
            setSubscriptionLoading(false)
            if (error.code != "E_USER_CANCELLED") {
                Alert.alert('', error.message, [{
                    text: getTranslation('ok'), onPress: () => {
                       
                    }
                }])
            }
        })

        return () => {
            purchaseUpdatedListener.remove()
            purchaseUpdatedListener = null
            purchaseErrorSubscription.remove()
            purchaseErrorSubscription = null
            RNIap.endConnection()
        }
    }, [])

    const vaidateReceiptIOS = async (purchase) => {
        var date = ''
        if (purchase.productId == 'dojo_monthly_subscription') {
            date = moment().add(31, 'days').format('YYYY-MM-DD')
        }
        else {
            date = moment().add(1, 'years').format('YYYY-MM-DD')
        }

        firestore()
            .collection('subscriber')
            .doc(user.email)
            .set({
                productId: purchase.productId,
                transactionDate: purchase.transactionDate,
                transactionId: purchase.transactionId,
                transactionReceipt: purchase.transactionReceipt,
                expiryDate: date,
                email: user.email,
                device: Platform.OS
            })
            .then(async () => {
                await RNIap.finishTransaction(purchase, true)
                setSubscriptionLoading(false);
                if (isAlert == false) {
                    setAlert(true)
                    mixPanelOnSubscriptionComplete(purchase)
                }
            }).catch((error) => {
                setSubscriptionLoading(false)
                Toast.show(error.message); 
            });
    }

    const validateReceiptANDROID = async (purchase) => {
        if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
            try {
                var date = ''
                if (purchase.productId == 'dojo_monthly_subscription') {
                    date = moment().add(31, 'days').format('YYYY-MM-DD')
                }
                else {
                    date = moment().add(1, 'years').format('YYYY-MM-DD')
                }

                firestore()
                    .collection('subscriber')
                    .doc(user.email)
                    .set({
                        productId: purchase.productId,
                        transactionDate: purchase.transactionDate,
                        transactionId: purchase.transactionId,
                        purchaseToken: purchase.purchaseToken,
                        expiryDate: date,
                        email: user.email,
                        device: Platform.OS
                    })
                    .then(async () => {
                        await RNIap.finishTransaction(purchase, true)
                        setSubscriptionLoading(false);
                        if (isAlert == false) {
                            setAlert(true)
                            mixPanelOnSubscriptionComplete(purchase)
                        }
                    }).catch((error) => {
                        setSubscriptionLoading(false)
                        Alert.alert('', error.message, [{
                            text: getTranslation('ok'), onPress: () => {
                                
                            }
                        }])
                    });
            } catch (ackErr) {
                setSubscriptionLoading(false)
                console.log('ackErr', ackErr);
            }
        }
    }


    useEffect(() => {
        if (isAlert == true) {
            Alert.alert(getTranslation('thank_you'), getTranslation('your_purchase_was_successful'), [
                {
                    text: getTranslation('ok'), onPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'Splash' }
                                ],
                            })
                        );
                    }
                }
            ])
        }
    }, [isAlert])

    const requestPurchase = async (sku) => {
        try {
            mixPanelOnClickPurchase({
                "email": user.email,
                "id": sku
            })
    
            setSubscriptionLoading(true)
            await RNIap.getProducts([sku])
            RNIap.requestPurchase(sku, false);
        } catch (error) {
            setSubscriptionLoading(false)
            setTimeout(() => {
                Toast.show(error.message);
                console.warn(error.code, error.message);
            }, 100);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header onBack={() => {
                navigation.goBack()
            }} />
            {isLoading ?
                <View style={{ height: 100, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                </View>
                :
                <View style={styles.container}>
                    <Image
                        style={{ alignSelf: 'center', width: '90%' }}
                        source={IMAGES.subscription_logo}
                        resizeMode='contain' />
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size={"22"}
                        weight="600"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation("choose_your_plan")}
                    </Text>
                    <View style={styles.priceContainer}>
                        <TouchableOpacity style={[styles.priceView, { borderWidth: isMonthly ? 1 : 0 }]}
                            onPress={() => setMonthly(true)}>
                            <Text
                                extraStyle={{ alignSelf: 'center' }}
                                size={"17"}
                                weight="600"
                                align='center'
                                color={COLORS.darkGray}>
                                {"Rp 99 000"}
                            </Text>
                            <Text
                                extraStyle={{ alignSelf: 'center', marginTop: 5 }}
                                size={"14"}
                                weight="400"
                                align='center'
                                color={COLORS.darkGray}>
                                {getTranslation('monthly_subscription')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.priceView, { borderWidth: isMonthly ? 0 : 1 }]}
                            onPress={() => setMonthly(false)}>
                            <Text
                                extraStyle={{ alignSelf: 'center' }}
                                size={"17"}
                                weight="600"
                                align='center'
                                color={COLORS.darkGray}>
                                {"Rp 299 000"}
                            </Text>
                            <Text
                                extraStyle={{ alignSelf: 'center', marginTop: 5 }}
                                size={"14"}
                                weight="400"
                                align='center'
                                color={COLORS.darkGray}>
                                {getTranslation("annual_subscription")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.subscribeButton}
                        onPress={() => {
                            if (isMonthly == true) {
                                requestPurchase('dojo_monthly_subscription')
                            }
                            else {
                                requestPurchase('dojo_yearly_subscription')
                            }
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="17"
                            weight="600"
                            align='center'
                            color={COLORS.white}>
                            {getTranslation('continue')}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
            {isSubscriptionLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    priceContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-around',
        marginVertical: 20
    },
    priceView: {
        width: '43%',
        aspectRatio: 1,
        borderColor: COLORS.orange,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        padding: 10,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    subscribeButton: {
        width: '80%',
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
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