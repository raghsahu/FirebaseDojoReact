import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, StatusBar, SafeAreaView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ImageBackground, Platform, Alert, NativeModule } from 'react-native';

//Context
import { APPContext } from '../context/AppProvider';

//Components
import { Header, ProgressView, Text } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import auth from '@react-native-firebase/auth';

export default function MySubscription({ navigation }) {

    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);
    const { isSubscribe, userSubscriptionDetails, RemainingDays } = useContext(APPContext);

    const [isLoading, setLoading] = useState(false)
    const [isRestoreLoading, setRestoreLoading] = useState(false)
    const [error, setError] = useState('')

    const getTitle = (id) => {
        if (id == 'dojo_monthly_subscription') {
            return getTranslation("monthly_subscription")
        }
        else if (id == 'dojo_six_month_subscription') {
            return getTranslation("Monthly Subscription")
        }
        else if (id == 'dojo_yearly_subscription') {
            return getTranslation("yearly_subscription")
        }
        else if (id == 'dojo_free_trial') {
            return getTranslation("free_trial")
        }
        else if (id == 'redeem_promo_code') {
            return getTranslation("redeem_code_subscription")
        }
        else {
            return ''
        }
    }

    const getPrice = (id) => {
        if (id == 'dojo_monthly_subscription') {
            return "Rp 99 0000"
        }
        else if (id == 'dojo_yearly_subscription') {
            return "Rp 299 0000"
        }
        else if (id == 'dojo_free_trial') {
            return getTranslation("free")
        }
        else if (id == 'redeem_promo_code') {
            return getTranslation("redeem_code_small")
        }
        else {
            return ''
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.bannerContainer}>
                            <ImageBackground style={{ width: '100%', height: 110, borderRadius: 10, overflow: 'hidden' }}
                                source={IMAGES.ic_wave}
                                resizeMode='stretch'>
                                <Text
                                    extraStyle={{ marginHorizontal: 16, marginTop: 10 }}
                                    size={"22"}
                                    weight="800"
                                    color={COLORS.white}>
                                    {user.displayName}
                                </Text>
                            </ImageBackground>
                            {isSubscribe == false ?
                                <View style={{ marginBottom: 30 }}>
                                    <Text
                                        extraStyle={{ marginTop: 10, marginHorizontal: 10 }}
                                        size={"16"}
                                        weight="400"
                                        align='center'
                                        color={COLORS.darkGray}>
                                        {getTranslation('not_subscribe_msg')}
                                    </Text>
                                    <TouchableOpacity style={styles.subscribeButton}
                                        onPress={() => navigation.navigate('Subscription')}>
                                        <Text
                                            extraStyle={{ alignSelf: 'center' }}
                                            size="17"
                                            weight="600"
                                            align='center'
                                            color={COLORS.white}>
                                            {getTranslation('subscribe_now')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.subcriptionDetails}>
                                    <View>
                                        <Text
                                            extraStyle={{ alignSelf: 'center' }}
                                            size={"22"}
                                            weight="800"
                                            align='center'
                                            color={COLORS.darkGray}>
                                            {getPrice(userSubscriptionDetails.productId)}
                                        </Text>
                                        <Text
                                            extraStyle={{ alignSelf: 'center', marginTop: 5 }}
                                            size={"14"}
                                            weight="500"
                                            align='center'
                                            color={COLORS.darkGray}>
                                            {getTitle(userSubscriptionDetails.productId)}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            extraStyle={{ alignSelf: 'center' }}
                                            size={"22"}
                                            weight="800"
                                            align='center'
                                            color={COLORS.darkGray}>
                                            {RemainingDays}
                                        </Text>
                                        <Text
                                            extraStyle={{ alignSelf: 'center', marginTop: 5 }}
                                            size={"14"}
                                            weight="500"
                                            align='center'
                                            color={COLORS.darkGray}>
                                            {getTranslation("day_left")}
                                        </Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                                extraStyle={{ marginHorizontal: 22, marginVertical: 20 }}
                                size={"22"}
                                weight="600"
                                color={COLORS.darkGray}>
                                {getTranslation('benefits')}
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={{ width: '43%' }}>
                                <View style={styles.itemView}>
                                    <Image style={{ flex: 1.0, alignSelf: 'center' }}
                                        source={IMAGES.book_subscription}
                                        resizeMode='contain' />
                                </View>
                                <Text
                                    extraStyle={{ marginTop: 10 }}
                                    size={"16"}
                                    weight="400"
                                    align='center'
                                    color={COLORS.darkGray}>
                                    {getTranslation('unlock_all_books')}
                                </Text>
                            </View>
                            <View style={{ width: '43%' }}>
                                <View style={styles.itemView}>
                                    <Image style={{ flex: 1.0, alignSelf: 'center' }}
                                        source={IMAGES.library_subscription}
                                        resizeMode='contain' />
                                </View>
                                <Text
                                    extraStyle={{ marginTop: 10 }}
                                    size={"16"}
                                    weight="400"
                                    align='center'
                                    color={COLORS.darkGray}>
                                    {getTranslation('able_to_use_library')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemContainer}>
                            <View style={{ width: '43%' }}>
                                <View style={styles.itemView}>
                                    <Image style={{ flex: 1.0, alignSelf: 'center' }}
                                        source={IMAGES.entire_subscription}
                                        resizeMode='contain' />
                                </View>
                                <Text
                                    extraStyle={{ marginTop: 10 }}
                                    size={"16"}
                                    weight="400"
                                    align='center'
                                    color={COLORS.darkGray}>
                                    {getTranslation('able_to_read_entire_book')}
                                </Text>
                            </View>
                            <View style={{ width: '43%' }} />
                        </View>
                    </ScrollView>
                </View>
            }
            {isRestoreLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    bannerContainer: {
        marginHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: 20
    },
    subcriptionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30
    },
    itemContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-around',
        marginVertical: 15
    },
    itemView: {
        aspectRatio: 1.4,
        borderColor: COLORS.orange,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        padding: 13,
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