import React, { useState, useContext } from 'react';
import { View, StatusBar, SafeAreaView, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

//Components
import { Header, Text as RNText, ProgressView } from '../components'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

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

    const [selectedMenu, setSelectedMenu] = useState('Refer a Friend')
    const [isLoading, setLoading] = useState(false)
    const [redeemCode, setRedeemCode] = useState('')

    const redeemPromoCode = () => {
        setLoading(true)
        firestore().collection('PromoCode')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let item = documentSnapshot.data()
                    if (item.isRedeem) {
                        setLoading(false)
                        Alert.alert('', getTranslation('you_have_already_redeem_this_code'))
                    }
                    else if (item.code == redeemCode) {
                        checkCurrentSubscriotion(item)
                    }
                    else {
                        setLoading(false)
                        Alert.alert('', getTranslation('please_enter_valid_code'))
                    }
                    console.log(item)
                }
                else {
                    setLoading(false)
                    Alert.alert('', getTranslation('please_enter_valid_code'))
                }
            }).catch((e) => {
                setLoading(false)
                Alert.alert('', getTranslation('please_enter_valid_code'))
            })
    }

    const checkCurrentSubscriotion = (item) => {
        firestore()
            .collection('subscriber')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let subscription = documentSnapshot.data()
                    addDaysToCurrentSubscription(item, subscription.expiryDate)
                }
                else {
                    addDaysToUser(item)
                }
            }).catch((e) => {
                setLoading(false)
                Alert.alert('', e.message)
            })
    }

    const addDaysToCurrentSubscription = (item, expiry) => {
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
                    successMessage()
                }).catch((error) => {
                    setLoading(false)
                    Alert.alert('', error.message)
                });
        }
    }

    const addDaysToUser = (item) => {
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
                successMessage()
            }).catch((error) => {
                setLoading(false)
                Alert.alert('', error.message)
            });
    }

    const successMessage = () => {
        Alert.alert(getTranslation('congratulations'), getTranslation('your_redeem_code_was_successful'), [
            {
                text: 'Ok', onPress: () => {
                    firestore().collection('PromoCode')
                    .doc(user.email)
                    .update({
                        isRedeem: true
                    })

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
            <Header onBack={() => navigation.goBack()} />
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
                    <TouchableOpacity style={styles.subscribeButton}
                        onPress={() => {
                            let ios = "https://apps.apple.com/us/app/dojo-infographics/id1582858619"
                            let android = "https://play.google.com/store/apps/details?id=com.dojoinfographic"

                            let msg = getTranslation('share_message') + `\nAndroid - ${android}\niOS - ${ios}.`
                            Share.open({
                                message: msg
                            }).then((res) => {
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
                            style={{ alignSelf: 'center', color: COLORS.grey, fontSize: 15 }}
                            value={redeemCode}
                            placeholder={'Code'}
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
})
