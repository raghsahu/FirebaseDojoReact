import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

//Components
import { Header, Text as RNText, BookItem } from '../components'

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { EventRegister } from 'react-native-event-listeners'

export default function AllAuthors({ navigation, route }) {
    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);

    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState('')
    const [books, setBook] = useState([]);
    const [LikedBooksID, setLikedBooksID] = useState([])
    const [search, setSearchText] = useState('')

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

    useEffect(async () => {
        getAllBooks()
        return () => { }
    }, [search])


    useEffect(async () => {
        getAllBooks()
        return () => { }
    }, [search])

    getAllBooks = async () => {
        try {
            var ref = firestore().collection('books')
            ref = ref.where('authorName', '!=', '')
            ref = ref.where('language', '==', global.languageName)
            ref = ref.orderBy('authorName')
            ref = ref.startAt(search)
            ref = ref.endAt(search + "\uf8ff")
            ref.get()
                .then(querySnapshot => {
                    var list = []
                    var authors = []
                    querySnapshot.forEach(documentSnapshot => {
                        var data = documentSnapshot.data()
                        data.id = documentSnapshot.id
                        if (authors.includes(data.authorName) == false) {
                            authors.push(data.authorName)
                            list.push(data)
                        }
                    });
                    console.log(list)
                    setLoading(false)
                    setError('')
                    setBook(list)
                })
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError(getTranslation("no_books_available_yet"))

        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={getTranslation("authors")} onBack={() => {
                navigation.goBack()
            }} />
            <View style={styles.searchView}
                onPress={() => {
                    navigation.navigate('Search')
                }}>
                <Image style={styles.searchIcon} source={IMAGES.ic_tab_discover} />
                <TextInput
                    style={{ flex: 1.0, marginHorizontal: 15, color: COLORS.grey }}
                    value={search}
                    placeholder={getTranslation('search')}
                    placeholderTextColor={COLORS.grey}
                    onChangeText={(text) => setSearchText(text)} />
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
                                        data={books}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => <View style={{ height: 20 }} />}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity style={styles.cellContainer} onPress={() => {
                                                    navigation.navigate('AuthorsBooks', {
                                                        item: item
                                                    })
                                                }}>
                                                    {/* <Image style={styles.authorsImage}
                                                        source={item.authorImage ? { uri: item.authorImage } : ''} /> */}
                                                    <RNText
                                                        extraStyle={{ alignSelf: 'center', marginHorizontal: 20 }}
                                                        size={"15"}
                                                        weight="400"
                                                        align='center'
                                                        color={COLORS.darkGray}>
                                                        {item.authorName}
                                                    </RNText>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                            }
                        </View>
                    }
                </View>

            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    cellContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    searchView: {
        height: 44,
        backgroundColor: '#f7f7f7',
        borderRadius: 6,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    searchIcon: {
        height: 15,
        width: 15,
        alignSelf: 'center',
        marginLeft: 15
    },
    tagView: {
        height: 44,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 8,
        marginLeft: 8
    },
    authorsImage: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
})

//Now you can commmit your code through the git hub. I set new branch for you google analytics everthing you can commit there
//TEST push code






