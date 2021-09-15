import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';

//Components
import { Header, Text as RNText, HomeBookItem } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Discover({ navigation }) {

    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState('')
    const [books, setBook] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const [authors, setAuthors] = useState([]);

    useEffect(async () => {
        getAllBooks()
        getTrendingBook()
        getAllAuthors()
        return () => { }
    }, [])

    getAllAuthors = async () => {
        try {
            const books = await firestore().collection('books').limit(12).get()
            var list = []
            var authors = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                if (authors.includes(data.authorName) == false) {
                    authors.push(data.authorName)
                    list.push(data)
                }
                console.log(data)
            });
            console.log(list)
            setLoading(false)
            setError('')
            setAuthors(list)
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setAuthors("No Books available yet.")
            console.log(e)
        }
    }

    getAllBooks = async () => {
        try {
            const books = await firestore().collection('books').where('category', '!=', '').limit(5).get()
            var list = []
            var categories = []
            books.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                if (categories.includes(data.category) == false) {
                    categories.push(data.category)
                    list.push(data)
                }
            });
            console.log("Category==>", list)
            setLoading(false)
            setError('')
            setBook(list)
        }
        catch (e) {
            setLoading(false)
            setBook([])
            setError("No Books available yet.")
            console.log(e)
        }
    }

    getTrendingBook = async () => {
        const books = await firestore().collection('books').where('trending', '==', true).limit(5).get()
        var list = []
        books.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data)
        });
        setTrendingBooks(list)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header type={'simple'} backTitle={'Discover'} />
            <TouchableOpacity style={styles.searchView}
                onPress={() => {
                    navigation.navigate('Search')
                }}>
                <Image style={styles.searchIcon} source={IMAGES.ic_tab_discover} />
                <RNText
                    extraStyle={{ alignSelf: 'center', marginHorizontal: 15 }}
                    size={"14"}
                    weight="400"
                    align='center'
                    color={COLORS.grey}>
                    {'#tags, titles or authors'}
                </RNText>
            </TouchableOpacity>
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <View style={styles.treadingHeader}>
                    <RNText
                        extraStyle={{ alignSelf: 'center' }}
                        size="20"
                        weight="400"
                        align='left'
                        color={COLORS.darkGray}>
                        {'Categories'}
                    </RNText>
                    <RNText
                        onPress={() => {
                            navigation.navigate('AllCategory')
                        }}
                        extraStyle={{ alignSelf: 'center' }}
                        size="14"
                        weight="400"
                        align='left'
                        color={COLORS.darkGray}>
                        {'See all'}
                    </RNText>
                </View>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={{ width: 12 }} />
                    <FlatList
                        data={books}
                        numColumns={3}
                        scrollEnabled={false}
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
                    <View style={{ width: 20 }} />
                </ScrollView>
                {trendingBooks && trendingBooks.length > 0 &&
                    <View>
                        <View style={styles.treadingHeader}>
                            <RNText
                                extraStyle={{ alignSelf: 'center' }}
                                size="20"
                                weight="400"
                                align='left'
                                color={COLORS.darkGray}>
                                {'Trending Books'}
                            </RNText>
                            <RNText
                                onPress={() => {
                                    navigation.navigate('TreadingBooks')
                                }}
                                extraStyle={{ alignSelf: 'center' }}
                                size="14"
                                weight="400"
                                align='left'
                                color={COLORS.darkGray}>
                                {'See all'}
                            </RNText>
                        </View>
                        <FlatList
                            style={{ marginVertical: 20 }}
                            horizontal
                            data={trendingBooks}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => item ? item.id : index.toString()}
                            renderItem={({ item, index }) =>
                                <View style={{ marginLeft: 20 }}>
                                    <HomeBookItem item={item} index={index}
                                        onPress={(item) =>
                                            navigation.navigate('Detail', {
                                                item: item
                                            })
                                        } />
                                </View>
                            }
                        />
                    </View>
                }
                {
                    authors && authors.length > 0 &&
                    <View>
                        <View style={styles.treadingHeader}>
                            <RNText
                                extraStyle={{ alignSelf: 'center' }}
                                size="20"
                                weight="400"
                                align='left'
                                color={COLORS.darkGray}>
                                {'Authors'}
                            </RNText>
                            <RNText
                                onPress={() => {
                                    navigation.navigate('AllAuthors')
                                }}
                                extraStyle={{ alignSelf: 'center' }}
                                size="14"
                                weight="400"
                                align='left'
                                color={COLORS.darkGray}>
                                {'See all'}
                            </RNText>
                        </View>
                        <FlatList
                            style={{ marginVertical: 20 }}
                            horizontal
                            data={authors}
                            showsHorizontalScrollIndicator={false}
                            ListFooterComponent={() => <View style={{ width: 20 }} />}
                            keyExtractor={(item, index) => item ? item.id : index.toString()}
                            renderItem={({ item, index }) =>
                                <View style={{ marginLeft: 20 }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('AuthorsBooks', {
                                            item: item
                                        })
                                    }}>
                                        <Image style={styles.authorsImage}
                                            source={item.authorImage ? { uri: item.authorImage } : ''} />
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    </View>
                }
            </ScrollView>
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
    treadingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20, marginTop: 30,
    },
    authorsImage: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
})