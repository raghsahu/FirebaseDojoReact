import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Dimensions, TouchableOpacity, Platform, Linking, Image as RNImage } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { APPContext } from '../context/AppProvider';
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Toast from 'react-native-simple-toast';
import moment from 'moment'
import InAppReview from 'react-native-in-app-review';
import { BlurView } from "@react-native-community/blur";
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

export default function ReadBook({ route, navigation }) {
    const item = route.params.item
    const user = auth().currentUser;

    const { isSubscribe } = useContext(APPContext);
    const { mixPanelRateBook, mixPanelInAppRating, mixPanelOnBookEndReading } = useContext(AnalyticsContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    var scrollRef = useRef(null)

    const [isLoading, setLoading] = useState(false)
    const [isScrollEnable, setScrollEnable] = useState(true)
    const [imageIndex, setImageIndex] = useState(0)
    const [isScrollDisable, setDisableScroll] = useState(false)
    const [bookRating, setBookRating] = useState(0)
    const [summaryRating, setSummaryRating] = useState(0)
    const [infographicsRating, setInfographicRating] = useState(0)

    const onBack = () => {
        mixPanelOnBookEndReading({ book: item, lastPage: imageIndex + 1 })
        navigation.goBack()
    }

    const handleScroll = (event) => {
        const positionX = event.nativeEvent.contentOffset.x;
        if (item.images && item.images.length > 0) {
            let width = Dimensions.get('window').width * item.images.length
            let index = positionX / Dimensions.get('window').width
            console.log(width, positionX)
            setImageIndex(Math.round(index))
            if (Math.round(positionX) >= Math.round(width)) {
                firestore().collection('readingCompleted')
                    .doc(user.email)
                    .collection('books')
                    .doc(item.id)
                    .set({
                        book: item
                    }).then(() => {

                    });

                firestore()
                    .collection('AllBookCompleted')
                    .doc("BookCount")
                    .get()
                    .then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                            let data = documentSnapshot.data()
                            if (data && data.count) {
                                let count = data.count + 1
                                firestore()
                                    .collection('AllBookCompleted')
                                    .doc("BookCount")
                                    .set({
                                        count: count
                                    })
                            }
                        }
                        else {
                            firestore()
                                .collection('AllBookCompleted')
                                .doc("BookCount")
                                .set({
                                    count: 1
                                })
                        }
                    })

                firestore()
                    .collection('BookCompleted')
                    .doc(item.id)
                    .get()
                    .then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                            let data = documentSnapshot.data()
                            if (data && data.count) {
                                let count = data.count + 1
                                firestore()
                                    .collection('BookCompleted')
                                    .doc(item.id)
                                    .set({
                                        count: count
                                    })
                            }
                        }
                        else {
                            firestore()
                                .collection('BookCompleted')
                                .doc(item.id)
                                .set({
                                    count: 1
                                })
                        }
                    })

                setScrollEnable(false)
            }
        }
    };

    const onRatingBook = () => {
        if (bookRating <= 0) {
            Toast.show(getTranslation('quality_book_warning'));
        }
        else if (summaryRating <= 0) {
            Toast.show(getTranslation('Please rate quality of summary'));
        }
        else if (infographicsRating <= 0) {
            Toast.show(getTranslation('quality_infographics_warning'));
        }
        else {
            setLoading(true)
            updateOnDatabase()
        }
    }

    const updateOnDatabase = async () => {
        let overall = (bookRating + summaryRating + infographicsRating) / 3

        let obj = {
            bookrating: bookRating,
            date: moment().format('DD-MM-YYYY'),
            email: user.email,
            feedback: '',
            overall: overall,
            infograficrating: infographicsRating,
            summaryrating: summaryRating,
            bookID: item.id,
            bookName: item.bookName
        }

        try {
            mixPanelRateBook(obj)
        }
        catch (e) {
            alert(JSON.stringify(e))
        }

        firestore()
            .collection(`feedback`)
            .doc(item.id)
            .collection('rating')
            .doc(user.email)
            .set({
                bookrating: bookRating,
                date: moment().format('DD-MM-YYYY'),
                email: user.email,
                feedback: '',
                overall: overall,
                infograficrating: infographicsRating,
                summaryrating: summaryRating
            }).then(() => {
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
            })

        firestore()
            .collection(`userRating`)
            .doc(user.email)
            .collection('books')
            .doc(item.id)
            .set({
                bookrating: bookRating,
                date: moment().format('DD-MM-YYYY'),
                email: user.email,
                feedback: '',
                overall: overall,
                infograficrating: infographicsRating,
                summaryrating: summaryRating,
                book: item
            }).then(() => {
                setLoading(false)
            }).catch((e) => {
                setLoading(false)
            })

        if (overall >= 4) {
            openInAppReview()
        }
        else {
            navigation.goBack()
        }
    }

    const openInAppReview = () => {
        let obj = { "email": user.email }
        mixPanelInAppRating(obj)

        if (InAppReview.isAvailable()) {
            InAppReview.RequestInAppReview()
                .then((hasFlowFinishedSuccessfully) => {
                    if (hasFlowFinishedSuccessfully) {
                        navigation.goBack()
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            if (Platform.OS == 'ios') {
                Linking.openURL('https://apps.apple.com/us/app/dojo-infographics/id1582858619')
            }
            else {
                Linking.openURL('market://details?id=com.dojoinfographic')
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header onBack={onBack} backTitle={isScrollEnable ? '' : getTranslation('write_review')} />
            {item && item.images &&
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    bounces={false}
                    scrollEnabled={isScrollEnable}
                    style={styles.container}
                    onScroll={handleScroll}>
                    {item.images.map((data, index) => {
                        if (index >= 4 && isSubscribe == false && !item.free_book_of_week) {
                            return (
                                <View style={styles.imageView}>
                                    <Image
                                        key={index}
                                        style={{ flex: 1.0 }}
                                        indicator={ProgressBar}
                                        source={data.url ? { uri: data.url } : ''}
                                        resizeMode='contain'
                                        indicatorProps={{
                                            size: 80,
                                            borderWidth: 0,
                                            color: COLORS.orange,
                                            unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                        }}>
                                        {imageIndex >= 4 &&
                                            <View style={styles.topView}>
                                                <BlurView
                                                    style={{ flex: 1.0 }}
                                                    blurType="xlight"
                                                    blurAmount={10}
                                                    reducedTransparencyFallbackColor="white">
                                                    <TouchableOpacity
                                                        activeOpacity={1}
                                                        style={{ flex: 1.0, justifyContent: 'center' }}
                                                        onPress={() => {
                                                            navigation.navigate('Subscription')
                                                        }}>
                                                        <RNImage style={styles.subsriptionImage}
                                                            source={IMAGES.subscription}
                                                            resizeMode='contain' />
                                                        <Text
                                                            extraStyle={{ marginTop: 10 }}
                                                            size="20"
                                                            weight="500"
                                                            align='center'
                                                            color={COLORS.black}>
                                                            {getTranslation('please_subscribe_to_continue')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </BlurView>
                                            </View>
                                        }
                                    </Image>
                                </View>
                            )
                        }

                        return (
                            <Image
                                key={index}
                                style={styles.imageView}
                                indicator={ProgressBar}
                                resizeMode='contain'
                                source={data.url ? { uri: data.url } : ''}
                                indicatorProps={{
                                    size: 80,
                                    borderWidth: 0,
                                    color: COLORS.orange,
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}>
                            </Image>
                        )
                    })}
                    {isSubscribe == true &&
                        <View style={styles.imageView}>
                            <Text
                                extraStyle={{ margin: 20 }}
                                size={"16"}
                                weight="400"
                                color={COLORS.darkGray}>
                                {getTranslation('quality_of_book')}
                            </Text>
                            <View style={styles.rateView}>
                                <View>
                                    <AirbnbRating
                                        type={'custom'}
                                        defaultRating={0}
                                        count={5}
                                        showRating={false}
                                        ratingColor={COLORS.orange}
                                        size={25}
                                        reviewSize={25}
                                        startingValue={0}
                                        onFinishRating={(rating) => setBookRating(rating)}
                                    />
                                </View>
                            </View>
                            <Text
                                extraStyle={{ margin: 20 }}
                                size={"16"}
                                weight="400"
                                color={COLORS.darkGray}>
                                {getTranslation('quality_of_summary')}
                            </Text>
                            <View style={styles.rateView}>
                                <View>
                                    <AirbnbRating
                                        type={'custom'}
                                        defaultRating={0}
                                        count={5}
                                        showRating={false}
                                        ratingColor={COLORS.orange}
                                        size={25}
                                        reviewSize={25}
                                        startingValue={0}
                                        onFinishRating={(rating) => setSummaryRating(rating)}
                                    />
                                </View>
                            </View>
                            <Text
                                extraStyle={{ margin: 20 }}
                                size={"16"}
                                weight="400"
                                color={COLORS.darkGray}>
                                {getTranslation('quality_of_infographics')}
                            </Text>
                            <View style={styles.rateView}>
                                <View>
                                    <AirbnbRating
                                        type={'custom'}
                                        defaultRating={0}
                                        count={5}
                                        showRating={false}
                                        ratingColor={COLORS.orange}
                                        size={25}
                                        reviewSize={25}
                                        startingValue={0}
                                        onFinishRating={(rating) => setInfographicRating(rating)}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.subscribeButton}
                                onPress={onRatingBook}>
                                <Text
                                    extraStyle={{ alignSelf: 'center' }}
                                    size="17"
                                    weight="600"
                                    align='center'
                                    color={COLORS.white}>
                                    {getTranslation('submit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
            }
            {isScrollEnable == true &&
                <View style={[styles.topViewItems, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    {imageIndex != 0 ?
                        <TouchableOpacity style={{ height: 40, width: 40, alignSelf: 'center' }}
                            onPress={() => {
                                if (isScrollDisable == false) {
                                    setDisableScroll(true)
                                    let index = imageIndex - 1
                                    if (index >= 0) {
                                        let x = index * Dimensions.get('window').width
                                        scrollRef.current.scrollTo({ x: x, animated: true })
                                    }

                                    setTimeout(() => {
                                        setDisableScroll(false)
                                    }, 100);
                                }
                            }}>
                            <Image style={{ height: 24, width: 24, alignSelf: 'center' }} source={IMAGES.back} />
                        </TouchableOpacity>
                        :
                        <View />
                    }
                    {item && item.images && item.images.length > (isSubscribe ? imageIndex : imageIndex + 1) ?
                        <TouchableOpacity style={{ height: 40, width: 40, alignSelf: 'center' }}
                            onPress={() => {
                                if (isScrollDisable == false) {
                                    setDisableScroll(true)
                                    let index = imageIndex + 1
                                    if (index >= 0) {
                                        let x = index * Dimensions.get('window').width
                                        scrollRef.current.scrollTo({ x: x, animated: true })
                                    }

                                    setTimeout(() => {
                                        setDisableScroll(false)
                                    }, 200);
                                }
                            }}>
                            <Image style={{ height: 24, width: 24, alignSelf: 'center' }} source={IMAGES.next} />
                        </TouchableOpacity>
                        :
                        <View />
                    }
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
    imageView: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
    rateView: {
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        flexDirection: 'row'
    },
    topView: {
        flex: 1.0,
        justifyContent: 'center',
    },
    topViewItems: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        alignSelf: 'center',
    },
    subscribeButton: {
        width: '80%',
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40
    },
    subsriptionImage: {
        width: '80%',
        alignSelf: 'center'
    }
})