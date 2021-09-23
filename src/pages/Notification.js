import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, StatusBar, SafeAreaView, StyleSheet, ActivityIndicator, Alert } from 'react-native';

//Components
import { Header, Text, NotificationItem, ProgressView } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import firestore from '@react-native-firebase/firestore';

export default function Notification({ navigation }) {

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [notifications, setNotificatios] = useState([]);
    const [isBookLoading, setBookLoading] = useState(false)

    const { getTranslation } = useContext(LocalizatiionContext);

    useEffect(async () => {
        const item = await firestore().collection('notifications').get()
        var list = []
        item.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            console.log(data.id)
            list.push(data)
        });
        console.log(list)
        setLoading(false)
        setNotificatios(list)
        return () => { }
    }, []);

    const getBookAndMove = async (id, notification) => {
        if (id) {
            setBookLoading(true)
            firestore().collection('books')
                .doc(id)
                .get()
                .then(documentSnapshot => {
                    setBookLoading(false)
                    if (documentSnapshot.exists) {
                        let data = documentSnapshot.data()
                        navigation.navigate('Detail', {
                            item: data
                        })
                    }
                    else {
                        Alert.alert('', getTranslation('This book is not available yet'), [{
                            text: getTranslation('ok'), onPress: () => {
                                navigation.goBack()
                            }
                        }])
                    }
                })
                .catch((error) => {
                    setBookLoading(false)
                })
        }
        else {
            navigation.navigate('NotificationDetails', {
                item: notification
            })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={getTranslation('notifications')} onBack={() => navigation.goBack()} />
            {isLoading ?
                <View style={{ height: 100, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                </View>
                :
                <View style={styles.container}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={notifications}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item, index }) =>
                            <NotificationItem item={item} index={index}
                                onPress={() => {
                                    getBookAndMove(item.bookId, item)
                                }} />
                        }
                    />
                </View>
            }
            {isBookLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
})
