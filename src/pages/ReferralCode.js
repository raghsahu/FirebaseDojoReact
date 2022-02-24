import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, StatusBar, TextInput, TouchableOpacity, Image, Platform, Linking } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import { CommonActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ReferralCode({ route, navigation }) {

    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);

    const [redeemCode, setRedeemCode] = useState('')

    const redeemPromoCode = () => {
        firestore()
            .collection('users')
            .doc(user.email)
            .update({
                used_referral_code: redeemCode,
            })
            .then(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Home' }
                        ],
                    })
                );
            }).catch((error) => {
                console.log(error)
            });
    }

    const onSkip = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' }
                ],
            })
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={getTranslation('referral_code')} type='simple' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.container, { marginTop: 20 }]}>
                    <Image style={{ alignSelf: 'center', margin: 20 }}
                        source={IMAGES.referal_img} />
                    <Text
                        extraStyle={{ alignSelf: 'center', margin: 20 }}
                        size={"17"}
                        weight="400"
                        align='center'
                        color={COLORS.darkGray}>
                        {getTranslation('referral_code')}
                    </Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                            value={redeemCode}
                            placeholder={getTranslation('referral_code')}
                            placeholderTextColor={COLORS.grey}
                            onChangeText={(text) => setRedeemCode(text)} />
                    </View>
                    <TouchableOpacity style={styles.subscribeButton}
                        onPress={() => {
                            if (redeemCode) {
                                redeemPromoCode()
                            }
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="17"
                            weight="600"
                            align='center'
                            color={COLORS.white}>
                            {getTranslation('submit')}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        onPress={onSkip}
                        extraStyle={{ alignSelf: 'center' }}
                        size="14"
                        weight="600"
                        align='center'
                        color={COLORS.orange}>
                        {getTranslation('skip')}
                    </Text>
                </View>
            </ScrollView>
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