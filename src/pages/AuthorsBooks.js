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

export default function AuthorsBooks({ navigation, route }) {
    const item = route.params.item
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
            const books = await firestore().collection('books').where('authorName', '==', item.authorName).get()
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
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={item.authorName} onBack={() => {
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
                                        style={{ marginVertical: 20 }}
                                        data={books}
                                        extraData={LikedBooksID}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString() + index.toString()}
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
})
