import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Rating } from 'react-native-ratings';
import { EventRegister } from 'react-native-event-listeners'
import Share from 'react-native-share';

export default function Detail({ route, navigation }) {
    const item = route.params.item
    const user = auth().currentUser;

    const { mixPanelOpenBookDetails } = useContext(AnalyticsContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    const [LikedBooksID, setLikedBooksID] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(async () => {
        getLikesIds((ids) => { setLikedBooksID(ids) })
        mixPanelOpenBookDetails(item)
        return () => { }
    }, [])

    useEffect(() => {
        var listener = EventRegister.addEventListener('liked_item_changed', () => {
            getLikesIds((ids) => { setLikedBooksID(ids) })
        })
        return () => {
            EventRegister.removeEventListener(listener)
        }
    }, [])

    const onPressRead = async () => {
        setLoading(true)

        firestore().collection('readingHistory')
            .doc(user.email)
            .collection('books')
            .doc(item.id)
            .set({
                book: item
            }).then(() => {
                setLoading(false)
                navigation.navigate('ReadBook', {
                    item: item
                })
            });

        firestore()
            .collection('AllBookCount')
            .doc("BookCount")
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data()
                    if (data && data.count) {
                        let count = data.count + 1
                        firestore()
                            .collection('AllBookCount')
                            .doc("BookCount")
                            .set({
                                count: count
                            })
                    }
                }
                else {
                    firestore()
                        .collection('AllBookCount')
                        .doc("BookCount")
                        .set({
                            count: 1
                        })
                }
            })


        firestore()
            .collection('BookStarted')
            .doc(item.id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let data = documentSnapshot.data()
                    if (data && data.count) {
                        let count = data.count + 1
                        firestore()
                            .collection('BookStarted')
                            .doc(item.id)
                            .set({
                                count: count
                            })
                    }
                }
                else {
                    firestore()
                        .collection('BookStarted')
                        .doc(item.id)
                        .set({
                            count: 1
                        })
                }
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            {item.book_file ?
                <Header
                    onBack={() => navigation.goBack()}
                    onShare={() => {
                        let ios = "https://apps.apple.com/us/app/dojo-infographics/id1582858619"
                        let android = "https://play.google.com/store/apps/details?id=com.dojoinfographic"

                        let msg = getTranslation('share_message') + "\n\nBook Name:" + item.bookName + "\nBook Description:" + item.description + `\n\nAndroid - ${android}\niOS - ${ios}.`
                        Share.open({
                            message: msg
                        }).then((res) => {
                            console.log(res);
                        }).catch((err) => {
                            err && console.log(err);
                        });
                    }}
                    onContent={() => {
                        navigation.navigate('PdfView', {
                            item: item
                        })
                    }} />
                :
                <Header
                    onBack={() => navigation.goBack()}
                    onShare={() => {
                        let ios = "https://apps.apple.com/us/app/dojo-infographics/id1582858619"
                        let android = "https://play.google.com/store/apps/details?id=com.dojoinfographic"

                        let msg = getTranslation('share_message') + "\n\nBook Name:" + item.bookName + "\nBook Description:" + item.description + `\n\nAndroid - ${android}\niOS - ${ios}.`
                        Share.open({
                            message: msg
                        }).then((res) => {
                            console.log(res);
                        }).catch((err) => {
                            err && console.log(err);
                        });
                    }} />
            }
            <View style={styles.imageView}>
                {item && item.images && item.images.length > 0 && item.images[0].url &&
                    <View style={styles.image}>
                        <Image style={{
                            flex: 1.0, borderRadius: 10, overflow: 'hidden'
                        }}
                            resizeMode='cover'
                            source={item.images[0].url ? { uri: item.images[0].url } : null} />
                    </View>
                }
            </View>
            <View style={styles.viewMain}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <TouchableOpacity style={styles.likeButton}
                            onPress={() => {
                                setLike(item, LikedBooksID, (ids) => {
                                    setLikedBooksID(ids)
                                    EventRegister.emit('liked_item_changed')
                                })
                            }}>
                            {LikedBooksID.includes(item.id) ?
                                <Image style={styles.likeImage}
                                    source={IMAGES.ic_like_selected}
                                    resizeMode='contain' />
                                :
                                <Image style={styles.likeImage}
                                    source={IMAGES.ic_like}
                                    resizeMode='contain' />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.likeButton}
                            onPress={() => {
                                navigation.navigate('Comments', {
                                    item: item
                                })
                            }}>
                            <Image style={styles.likeImage}
                                source={IMAGES.comment}
                                resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                    <Text
                        extraStyle={{ marginLeft: 10, marginRight: 40, marginTop: -5 }}
                        size="17"
                        weight="600"
                        color={COLORS.darkGray}>
                        {item.bookName}
                    </Text>
                    <Text
                        extraStyle={{ marginHorizontal: 10, marginTop: 5 }}
                        size="13"
                        weight="400"
                        color={COLORS.darkGray}>
                        {item.description}
                    </Text>
                    <View style={{ marginLeft: 8, marginTop: 8 }} >
                        <Rating
                            type={'custom'}
                            disabled={true}
                            count={5}
                            ratingColor={COLORS.orange}
                            readonly={true}
                            imageSize={16}
                            startingValue={item.numberOfStars}
                            style={{ alignSelf: 'flex-start' }}
                        />
                    </View>
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
                        {getTranslation('read')}
                    </Text>
                </TouchableOpacity>
            </View>
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