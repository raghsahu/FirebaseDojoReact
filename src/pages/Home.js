import React, { useState, useEffect, useRef, useContext } from 'react';
import { RefreshControl, View, StatusBar, SafeAreaView, Image, TouchableOpacity, FlatList, ScrollView, Modal, ActivityIndicator, StyleSheet } from 'react-native';

//Components
import { Header, Text as RNText, HomeBookItem } from '../components'
import Menu from './Menu'

//Context
import { APPContext } from '../context/AppProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Drawer from 'react-native-drawer'

export default function Home({ navigation }) {

    const user = auth().currentUser;

    const { isSubscribe, getSubscriptionDetails } = useContext(APPContext);

    var drawer = useRef(null)

    const [isLoading, setLoading] = useState(true)
    const [books, setBook] = useState([]);
    const [freeBooks, setFreeBook] = useState([]);
    const [recentRead, setRecentRead] = useState([])
    const [mostReadBook, setMostReadBooks] = useState([])
    const [isVisibleSubscribe, setVisibleSubsribe] = useState(false)

    useEffect(async () => {
        await getFreeBooks()
        if (isSubscribe) {
            await getAllBooks()
            await getRecentRead()
            await getMostRead()
        }
        setLoading(false)
        getSubscriptionDetails((finished) => { })
        return () => { }
    }, [])


    getFreeBooks = async () => {
        let limit = isSubscribe ? 5 : 3
        const books = await firestore().collection('books').where('free_book_of_week', '==', true).limit(limit).get()
        var list = []
        books.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data)
        });
        setFreeBook(list)
    }

    getAllBooks = async () => {
        const books = await firestore().collection('books').get()
        var list = []
        books.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data)
        });
        setBook(list)
    }

    getRecentRead = async () => {
        const books = await firestore().collection('readingHistory')
            .doc(user.email)
            .collection('books')
            .limit(5)
            .get()
        var list = []
        books.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data.book)
        });
        setRecentRead(list)
    }

    getMostRead = async () => {
        const books = await firestore().collection('books').where('most_read_book', '==', true).limit(5).get()
        var list = []
        books.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data)
        });
        setMostReadBooks(list)
    }

    const onRefresh = async () => {
        await getFreeBooks()
        if (isSubscribe) {
            await getAllBooks()
            await getRecentRead()
            await getMostRead()
        }
        setLoading(false)
        getSubscriptionDetails((finished) => { })
        updateToken()
        return () => { }
    }

    const updateToken = async () => {
        messaging().getToken().then(token => {
            if (token) {
                firestore().collection('users').doc(user.email).update({
                    tokens: firestore.FieldValue.arrayUnion(token),
                    update_date: firestore.FieldValue.serverTimestamp(),
                })
            }
        });
    }

    const onPressMenu = (type) => {
        drawer.close()
        if (type == 'edit') {
            navigation.navigate('EditProfile')
        }
        else if (type == 'subscription') {
            navigation.navigate('MySubscription')
        }
        else if (type == 'refer_friend') {
            navigation.navigate('ReferFriend')
        }
        else if (type == 'my_review') {
            navigation.navigate('MyReview')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Drawer
                ref={(ref) => drawer = ref}
                tapToClose={true}
                openDrawerOffset={0.4}
                content={<Menu onPressItem={onPressMenu} />}>
                <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
                <Header
                    onMenu={() => {
                        drawer.open()
                    }}
                    onNotification={() => navigation.navigate("Notification")} />
                <ScrollView
                    style={{ flex: 1.0 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                            colors={[COLORS.darkorange]}
                        />
                    }>
                    {isLoading ?
                        <View style={{ height: 100, justifyContent: 'center' }}>
                            <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                        </View>
                        :
                        <View style={styles.container}>
                            <SubscriptionBanner isSubscribe={isSubscribe} navigation={navigation} />
                            {freeBooks && freeBooks.length > 0 &&
                                <View>
                                    <RNText
                                        extraStyle={{ marginHorizontal: 20 }}
                                        size="20"
                                        weight="400"
                                        align='left'
                                        color={COLORS.darkGray}>
                                        {'Free books for this week'}
                                    </RNText>
                                    <FlatList
                                        style={{ marginVertical: 20 }}
                                        horizontal
                                        data={freeBooks}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString()}
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
                            {books && books.length > 0 &&
                                <View>
                                    <RNText
                                        extraStyle={{ marginHorizontal: 20 }}
                                        size="20"
                                        weight="400"
                                        align='left'
                                        color={COLORS.darkGray}>
                                        {'Books for You'}
                                    </RNText>
                                    <FlatList
                                        style={{ marginVertical: 20 }}
                                        horizontal
                                        data={books}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString()}
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
                            {recentRead && recentRead.length > 0 &&
                                <View>
                                    <RNText
                                        extraStyle={{ marginHorizontal: 20 }}
                                        size="20"
                                        weight="400"
                                        align='left'
                                        color={COLORS.darkGray}>
                                        {'Recently read'}
                                    </RNText>
                                    <FlatList
                                        style={{ marginVertical: 20 }}
                                        horizontal
                                        data={recentRead}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString()}
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
                            {mostReadBook && mostReadBook.length > 0 &&
                                <View>
                                    <RNText
                                        extraStyle={{ marginHorizontal: 20 }}
                                        size="20"
                                        weight="400"
                                        align='left'
                                        color={COLORS.darkGray}>
                                        {'Most read books'}
                                    </RNText>
                                    <FlatList
                                        style={{ marginVertical: 20 }}
                                        horizontal
                                        data={mostReadBook}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString()}
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
                        </View>
                    }
                </ScrollView>
            </Drawer>
            <SubscribtionView
                navigation={navigation}
                visible={isVisibleSubscribe}
                onClose={() => setVisibleSubsribe(false)} />
        </SafeAreaView>
    )
}

const SubscriptionBanner = (props) => {
    if (props.isSubscribe == false) {
        return (
            <View>
                <Image
                    style={{ alignSelf: 'center', width: '90%', backgroundColor: 'rgba(0,0,0,0.1)', marginTop: 10 }}
                    source={IMAGES.banner}
                    resizeMode='cover' />
                <TouchableOpacity style={styles.subscribeButton}
                    onPress={() => props.navigation.navigate('Subscription')}>
                    <RNText
                        extraStyle={{ alignSelf: 'center' }}
                        size="17"
                        weight="600"
                        align='center'
                        color={COLORS.white}>
                        {'SUBSCRIBE NOW'}
                    </RNText>
                </TouchableOpacity>
            </View>
        )
    }

    return null
}

const SubscribtionView = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                props.onClose()
            }}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
                <Header
                    title={'Get Premium Access'}
                    onClose={() => props.onClose()} />
                <Image
                    style={{ alignSelf: 'center', width: 250, height: 300, marginVertical: 25 }}
                    source={IMAGES.subscribtion_img}
                    resizeMode='contain' />
                <RNText
                    extraStyle={{ alignSelf: 'center', marginHorizontal: 20, marginVertical: 25 }}
                    size="18"
                    weight="400"
                    align='center'
                    color={COLORS.darkGray}>
                    {'Get access to view the entire library of infographics and choose whichever book to read!'}
                </RNText>
                <TouchableOpacity style={styles.subscribeButton}
                    onPress={() => {
                        props.onClose()
                        props.navigation.navigate('Subscription')
                    }}>
                    <RNText
                        extraStyle={{ alignSelf: 'center' }}
                        size="17"
                        weight="600"
                        align='center'
                        color={COLORS.white}>
                        {'SUBSCRIBE NOW'}
                    </RNText>
                </TouchableOpacity>
                <RNText
                    onPress={() => props.onClose()}
                    extraStyle={{ alignSelf: 'center', marginHorizontal: 20, marginVertical: 10 }}
                    size="18"
                    weight="400"
                    align='center'
                    color={COLORS.darkGray}>
                    {'Start a 1 Week Trial'}
                </RNText>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
