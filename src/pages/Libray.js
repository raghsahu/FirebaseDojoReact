import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StatusBar, SafeAreaView, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';

//Components
import { Header, Text as RNText, BookItem } from '../components'

//Context
import { APPContext } from '../context/AppProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { EventRegister } from 'react-native-event-listeners'
import { BlurView } from "@react-native-community/blur";
import Toast from 'react-native-simple-toast';

export default function Libray({ navigation }) {
    const user = auth().currentUser;

    const { isSubscribe } = useContext(APPContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    var menuList = useRef(null)
    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState('')
    const [books, setBook] = useState([]);
    const [LikedBooksID, setLikedBooksID] = useState([])

    const menu = ['All Title', 'Started', 'Most Rated', 'Liked']
    const [selectedMenu, setSelectedMenu] = useState('All Title')

    useEffect(async () => {
        getAllBooks()
        getLikesIds((ids) => { setLikedBooksID(ids) })
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

    useEffect(() => {
        setLoading(true)
        if (selectedMenu == 'All Title') {
            getAllBooks()
        }
        else if (selectedMenu == 'Most Rated') {
            getMostRated()
        }
        else if (selectedMenu == 'Liked') {
            getLiked()
        }
        else if (selectedMenu == 'Started') {
            getStarted()
        }
        return () => { }
    }, [selectedMenu])

    getAllBooks = async () => {
        try {
            const books = await firestore()
                .collection('books')
                .where('language', '==', global.languageName)
                .get()
            var list = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                console.log(data.id)
                list.push(data)
            });
            console.log(list)
            setLoading(false)
            setError('')
            setBook(list)
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError(getTranslation("no_books_available_yet"))
            Toast.show(e.message);
        }
    }

    getMostRated = async () => {
        try {
            const books = await firestore()
                .collection('books')
                .where('language', '==', global.languageName)
                .where('numberOfStars', '>=', '4')
                .get()
            var list = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                console.log(data.id)
                list.push(data)
            });
            console.log(list)
            setLoading(false)
            setError('')
            setBook(list)
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError(getTranslation("no_books_available_yet"))
            console.log(e)
            Toast.show(e.message);
        }
    }

    getLiked = async () => {
        try {
            const books = await firestore().collection('likeBooks')
                .doc(user.email)
                .collection('books')
                .get()
            var list = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                console.log(data.book)
                list.push(data.book)
            });
            console.log(list)
            if (list.length > 0) {
                setLoading(false)
                setError('')
                setBook(list)
            }
            else {
                setLoading(false)
                setBook([])
                setError(getTranslation("like_book_no_record"))
            }
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError(getTranslation("like_book_no_record"))
            console.log(e)
            Toast.show(e.message);
        }
    }

    getStarted = async () => {
        try {
            const books = await firestore().collection('readingHistory')
                .doc(user.email)
                .collection('books')
                .get()
            var list = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                console.log(data.book)
                list.push(data.book)
            });
            console.log(list)
            if (list.length > 0) {
                setLoading(false)
                setError('')
                setBook(list)
            }
            else {
                setLoading(false)
                setBook([])
                setError(getTranslation("start_book_no_record"))
            }
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError(getTranslation("start_book_no_record"))
            Toast.show(e.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header type={'simple'} backTitle={getTranslation('my_library')} />
            <View style={styles.container}>
                <View>
                    <FlatList
                        ref={(ref) => menuList = ref}
                        style={{ marginTop: 20 }}
                        horizontal={true}
                        data={menu}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.toString()}
                        renderItem={({ item, index }) =>
                            <View>
                                <RNText
                                    onPress={() => {
                                        menuList.scrollToIndex({ index: index, animated: true })
                                        setSelectedMenu(item)
                                    }}
                                    extraStyle={{ alignSelf: 'center', marginHorizontal: 20 }}
                                    size={selectedMenu == item ? "16" : "15"}
                                    weight="400"
                                    align='center'
                                    color={COLORS.darkGray}>
                                    {getTranslation(item)}
                                </RNText>
                                {selectedMenu == item &&
                                    <View style={{ width: 30, backgroundColor: COLORS.orange, height: 3, alignSelf: 'center', marginTop: 5 }} />
                                }
                            </View>
                        }
                    />
                </View>
                {isLoading ?
                    <View style={{ height: 100, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                    </View>
                    :
                    <View style={{ flex: 1.0 }}>
                        {isError != '' ?
                            <View style={{ flex: 1.0, justifyContent: 'center' }}>
                                <RNText
                                    extraStyle={{ alignSelf: 'center', marginHorizontal: 20 }}
                                    size={"15"}
                                    weight="400"
                                    align='center'
                                    color={COLORS.darkGray}>
                                    {isError}
                                </RNText>
                            </View>
                            :
                            <View style={styles.container}>
                                {books && books.length > 0 &&
                                    <View style={styles.container}>
                                        <FlatList
                                            style={{ marginVertical: 20 }}
                                            data={books}
                                            extraData={LikedBooksID}
                                            showsVerticalScrollIndicator={false}
                                            keyExtractor={(item, index) => (item && item.id ? item.id.toString() : "") + index.toString()}
                                            renderItem={({ item, index }) =>
                                                <BookItem
                                                    isLiked={LikedBooksID.includes(item.id)}
                                                    item={item}
                                                    index={index}
                                                    onPress={(item) =>
                                                        navigation.navigate('Detail', {
                                                            item: item
                                                        })
                                                    }
                                                    onLike={(item) => {
                                                        setLike(item, LikedBooksID, (ids) => {
                                                            setLikedBooksID(ids)
                                                            if (selectedMenu == 'Liked') {
                                                                getLiked()
                                                            }
                                                            EventRegister.emit('liked_item_changed')
                                                        })
                                                    }} />
                                            }
                                        />
                                    </View>
                                }
                            </View>
                        }
                    </View>

                }
            </View>
            {isSubscribe == false &&
                <BlurView
                    style={[styles.subscriptionContainer]}
                    blurType="xlight"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white">
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1.0, justifyContent: 'center' }}
                        onPress={() => {
                            navigation.navigate('Subscription')
                        }}>
                        <Image style={styles.subsriptionImage}
                            source={IMAGES.subscription}
                            resizeMode='contain' />
                        <RNText
                            extraStyle={{ marginTop: 10 }}
                            size="20"
                            weight="500"
                            align='center'
                            color={COLORS.black}>
                            {getTranslation('please_subscribe_to_continue')}
                        </RNText>
                    </TouchableOpacity>
                </BlurView>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    subscriptionContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    subsriptionImage: {
        alignSelf: 'center',
        width: '80%',
    }
})
