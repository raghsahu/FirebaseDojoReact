import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

//Components
import { Header, Text as RNText, BookItem } from '../components'

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { EventRegister } from 'react-native-event-listeners'

export default function AllCategory({ navigation, route }) {
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

    getAllBooks = async () => {
        try {
            var ref = firestore().collection('books')
            ref = ref.where('category', '!=', '')
            ref = ref.where('language', '==', global.languageName)
            ref = ref.orderBy('category')

            ref.get()
                .then(querySnapshot => {
                    var list = []
                    var categories = []
                    querySnapshot.forEach(documentSnapshot => {
                        var data = documentSnapshot.data()
                        data.id = documentSnapshot.id
                        if (categories.includes(data.category) == false) {
                            categories.push(data.category)
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
            setError("No Books available yet.")
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={getTranslation("categories")} onBack={() => {
                navigation.goBack()
            }} />
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
                                        contentContainerStyle={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap'
                                        }}
                                        data={books}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity style={styles.tagView}
                                                    onPress={() => {
                                                        navigation.navigate('Category', {
                                                            item: item.category
                                                        })
                                                    }}>
                                                    <RNText
                                                        extraStyle={{ alignSelf: 'center' }}
                                                        size="16"
                                                        weight="400"
                                                        align='left'
                                                        color={COLORS.darkGray}>
                                                        {item.category}
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
})
