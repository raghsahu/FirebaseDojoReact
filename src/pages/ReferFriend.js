import React, { useState, useContext, useEffect } from 'react';
import { View, StatusBar, SafeAreaView, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

//Components
import { Header, Text as RNText, ProgressView } from '../components'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';
import { AnalyticsContext } from '../context/AnalyticsProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Share from 'react-native-share';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';

export default function ReferFriend({ navigation }) {

    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);
    const { mixPanelOnReferAFriend } = useContext(AnalyticsContext);

    const [selectedMenu, setSelectedMenu] = useState('Refer a Friend')
    const [isLoading, setLoading] = useState(false)
    const [redeemCode, setRedeemCode] = useState('')
    const [referralCode, setReferralCode] = useState('')

    useEffect(() => {
        try {
            firestore()
                .collection('users')
                .doc(user.email)
                .onSnapshot(documentSnapshot => {
                    setLoading(false)
                    let data = documentSnapshot.data()
                    setReferralCode(data.referral_code)
                })
        }
        catch (e) {
            Alert.alert('', e.message, [{
                text: getTranslation('ok'), onPress: () => {

                }
            }])
        }
        return () => { }
    }, [])

    const redeemPromoCode = () => {
        setLoading(true)
        firestore().collection('PromoCode')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let item = documentSnapshot.data()
                    if (item.code == redeemCode) {
                        if (item.isRedeem) {
                            setLoading(false)
                            Alert.alert('', getTranslation('you_have_already_redeem_this_code'), [{
                                text: getTranslation('ok'), onPress: () => {

                                }
                            }])
                        }
                        else {
                            checkCurrentSubscriotion(item, false)
                        }
                    }
                    else {
                        reedeemGenericPromocode()
                    }
                    console.log(item)
                }
                else {
                    reedeemGenericPromocode()
                }
            }).catch((e) => {
                setLoading(false)
                Alert.alert('', getTranslation('please_enter_valid_code'), [{
                    text: getTranslation('ok'), onPress: () => {

                    }
                }])
            })
    }

    const reedeemGenericPromocode = async () => {
        const codes = await firestore().collection('GenericCode')
            .where('code', '==', redeemCode)
            .get()

        var list = []
        codes.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data)
            list.push(data)
        });

        if (list.length > 0) {
            let item = list[0]
            if (item.emails && item.emails.includes(user.email)) {
                setLoading(false)
                Alert.alert('', getTranslation('you_have_already_redeem_this_code'), [{
                    text: getTranslation('ok'), onPress: () => {

                    }
                }])
            }
            else {
                setLoading(false)
                checkCurrentSubscriotion(item, true)
            }
        }
        else {
            setLoading(false)
            Alert.alert('', getTranslation('please_enter_valid_code'), [{
                text: getTranslation('ok'), onPress: () => {

                }
            }])
        }
    }

    const checkCurrentSubscriotion = (item, isFromGeneric) => {
        firestore()
            .collection('subscriber')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let subscription = documentSnapshot.data()
                    addDaysToCurrentSubscription(item, subscription.expiryDate, isFromGeneric)
                }
                else {
                    addDaysToUser(item, isFromGeneric)
                }
            }).catch((e) => {
                setLoading(false)
                Alert.alert('', e.message, [{
                    text: getTranslation('ok'), onPress: () => {

                    }
                }])
            })
    }

    const addDaysToCurrentSubscription = (item, expiry, isFromGeneric) => {
        let date = moment(expiry, 'YYYY-MM-DD')
        if (moment().isAfter(date)) {
            addDaysToUser(item)
        }
        else {
            let final = date.add(item.days, 'days').format('YYYY-MM-DD')
            firestore()
                .collection('subscriber')
                .doc(user.email)
                .set({
                    productId: 'redeem_promo_code',
                    transactionDate: moment().millisecond(),
                    transactionId: '',
                    transactionReceipt: '',
                    expiryDate: final,
                    email: user.email,
                    device: Platform.OS
                })
                .then(async () => {
                    setLoading(false)
                    successMessage(item, isFromGeneric)
                }).catch((error) => {
                    setLoading(false)
                    Alert.alert('', error.message, [{
                        text: getTranslation('ok'), onPress: () => {

                        }
                    }])
                });
        }
    }

    const addDaysToUser = (item, isFromGeneric) => {
        let date = moment().add(item.days, 'days').format('YYYY-MM-DD')
        firestore()
            .collection('subscriber')
            .doc(user.email)
            .set({
                productId: 'redeem_promo_code',
                transactionDate: moment().millisecond(),
                transactionId: '',
                transactionReceipt: '',
                expiryDate: date,
                email: user.email,
                device: Platform.OS
            })
            .then(async () => {
                setLoading(false)
                successMessage(item, isFromGeneric)
            }).catch((error) => {
                setLoading(false)
                Alert.alert('', error.message, [{
                    text: getTranslation('ok'), onPress: () => {

                    }
                }])
            });
    }

    const successMessage = (item, isFromGeneric) => {
        Alert.alert(getTranslation('congratulations'), getTranslation('your_redeem_code_was_successful'), [
            {
                text: getTranslation('ok'), onPress: () => {
                    if (isFromGeneric) {
                        try {
                            firestore().collection('GenericCode')
                                .doc(item.id)
                                .update({
                                    emails: firestore.FieldValue.arrayUnion(user.email),
                                })
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
                    else {
                        firestore().collection('PromoCode')
                            .doc(user.email)
                            .update({
                                isRedeem: true
                            })
                    }

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            {/* <Header onBack={() => navigation.goBack()} /> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 }}>
                <View>
                    <RNText
                        onPress={() => {
                            setSelectedMenu('Refer a Friend')
                        }}
                        extraStyle={{ alignSelf: 'center', marginHorizontal: 20 }}
                        size={selectedMenu == 'Refer a Friend' ? "18" : "16"}
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation('Refer a Friend')}
                    </RNText>
                    {selectedMenu == 'Refer a Friend' &&
                        <View style={{ width: 100, backgroundColor: COLORS.orange, height: 3, alignSelf: 'center', marginTop: 5 }} />
                    }
                </View>
                <View>
                    <RNText
                        onPress={() => {
                            setSelectedMenu('Earning')
                        }}
                        extraStyle={{ alignSelf: 'center', marginHorizontal: 20 }}
                        size={selectedMenu == 'Earning' ? "18" : "16"}
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation('Redeem!')}
                    </RNText>
                    {selectedMenu == 'Earning' &&
                        <View style={{ width: 100, backgroundColor: COLORS.orange, height: 3, alignSelf: 'center', marginTop: 5 }} />
                    }
                </View>
            </View>
            {selectedMenu == 'Refer a Friend' &&
                <ScrollView showsVerticalScrollIndicator={false}>
                    <RNText
                        extraStyle={{ alignSelf: 'center', margin: 20 }}
                        size={"22"}
                        weight="600"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation('refer_a_friend_message')}
                    </RNText>
                    <Image style={{ alignSelf: 'center', margin: 20 }}
                        source={IMAGES.referal_img} />
                    <RNText
                        extraStyle={{ alignSelf: 'center', margin: 20 }}
                        size={"17"}
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation("get_referal_subscription")}
                    </RNText>
                    <View style={styles.codeView}>
                        <RNText
                            extraStyle={{ alignSelf: 'center' }}
                            size={"17"}
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {referralCode}
                        </RNText>
                    </View>
                    <TouchableOpacity style={styles.subscribeButton}
                        onPress={() => {
                            let ios = "https://apps.apple.com/us/app/dojo-infographics/id1582858619"
                            let android = "https://play.google.com/store/apps/details?id=com.dojoinfographic"

                            let msg = getTranslation('share_message') + `\nAndroid - ${android}\niOS - ${ios}\n\nReferral Code - ${referralCode}.`
                            Share.open({
                                message: msg
                            }).then((res) => {
                                mixPanelOnReferAFriend({ "email": user.email })
                                console.log(res);
                            }).catch((err) => {
                                err && console.log(err);
                            });
                        }}>
                        <RNText
                            extraStyle={{ alignSelf: 'center' }}
                            size="17"
                            weight="600"
                            align='center'
                            color={COLORS.white}>
                            {getTranslation('share')}
                        </RNText>
                    </TouchableOpacity>
                </ScrollView>
            }
            {selectedMenu == 'Earning' &&
                <View style={[styles.container, { marginTop: 20 }]}>
                    <RNText
                        extraStyle={{ alignSelf: 'center', margin: 20 }}
                        size={"17"}
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation('redeemcode_message')}
                    </RNText>
                    <View style={styles.inputView}>
                        <TextInput
                            style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                            value={redeemCode}
                            placeholder={getTranslation('Code')}
                            placeholderTextColor={COLORS.grey}
                            onChangeText={(text) => setRedeemCode(text)} />
                    </View>
                    <TouchableOpacity style={styles.subscribeButton}
                        onPress={() => {
                            if (redeemCode) {
                                redeemPromoCode()
                            }
                        }}>
                        <RNText
                            extraStyle={{ alignSelf: 'center' }}
                            size="17"
                            weight="600"
                            align='center'
                            color={COLORS.white}>
                            {getTranslation('redeem_code')}
                        </RNText>
                    </TouchableOpacity>
                </View>
            }
            {isLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    referalView: {
        height: 44,
        width: 200,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        marginVertical: 10
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
    inputView: {
        height: 44,
        backgroundColor: '#f7f7f7',
        borderRadius: 6,
        flexDirection: 'row',
        marginHorizontal: 25,
        marginTop: 9,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    codeView: {
        height: 44,
        width: 160,
        alignSelf: 'center',
        backgroundColor: 'rgba(235,235,235,1)',
        borderRadius: 8,
        justifyContent: 'center'
    }
})
