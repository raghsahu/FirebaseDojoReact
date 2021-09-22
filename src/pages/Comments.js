import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, KeyboardAvoidingView, FlatList } from 'react-native'

//Components
import { Header, Text, ProgressView, BookItem } from '../components'

//Modal
import { getLikesIds, setLike } from '../modal/LikeModal'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth';
import { EventRegister } from 'react-native-event-listeners'
import moment from 'moment';

export default function Comments({ route, navigation }) {
    const item = route.params.item
    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);
    const [isLoading, setLoading] = useState(true)
    const [LikedBooksID, setLikedBooksID] = useState([])
    const [commentTxt, setCommentTxt] = useState('')
    const [comments, setComments] = useState([])

    useEffect(async () => {
        getLikesIds((ids) => { setLikedBooksID(ids) })
        return () => { }
    }, [])

    useEffect(async () => {
        var items = await firestore()
            .collection(`comments`)
            .doc(item.id)
            .collection('comments')
            .orderBy('createdAt', 'asc')
            .get()
        setLoading(false)

        var list = []
        items.forEach(documentSnapshot => {
            var data = documentSnapshot.data()
            data.id = documentSnapshot.id
            list.push(data)
        });
        setComments(list.reverse())
    }, [])

    useEffect(() => {
        var listener = EventRegister.addEventListener('liked_item_changed', () => {
            getLikesIds((ids) => { setLikedBooksID(ids) })
        })
        return () => {
            EventRegister.removeEventListener(listener)
        }
    }, [])

    const onSendComment = () => {
        if (commentTxt.trim()) {
            let text = commentTxt.trim()
            setCommentTxt('')

            let comment = {
                comment: text,
                name: user.displayName,
                email: user.email,
                date: moment().format('DD MMM YYYY hh:mm a'),
                createdAt: firestore.FieldValue.serverTimestamp(),
            }

            setComments(comments => [comment, ...comments]);

            firestore()
                .collection(`comments`)
                .doc(item.id)
                .collection('comments')
                .add(comment)
                .catch(err => {
                    console.error('error adding comment: ', err)
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header title={getTranslation('comments')} onBack={() => navigation.goBack()} />
            <BookItem
                isLiked={LikedBooksID.includes(item.id)}
                item={item}
                index={0}
                onPress={(item) =>
                    navigation.navigate('Detail', {
                        item: item
                    })
                }
                onLike={(item) => {
                    setLike(item, LikedBooksID, (ids) => {
                        setLikedBooksID(ids)
                        getLiked()
                        EventRegister.emit('liked_item_changed')
                    })
                }} />
            <View style={{ flex: 1.0 }}>
                {isLoading ?
                    <View style={{ height: 100, justifyContent: 'center' }}>
                        <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                    </View>
                    :
                    <FlatList
                        ref={(ref) => menuList = ref}
                        data={comments}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.toString()}
                        renderItem={({ item, index }) =>
                            <View style={styles.commentView}>
                                <Text
                                    size={"13"}
                                    weight="600"
                                    color={COLORS.darkGray}>
                                    {item.name}
                                </Text>
                                <Text
                                    size={"14"}
                                    weight="400"
                                    color={COLORS.darkGray}>
                                    {item.comment}
                                </Text>
                                <Text
                                    size={"12"}
                                    weight="300"
                                    align='right'
                                    color={COLORS.darkGray}>
                                    {item.date}
                                </Text>
                            </View>
                        }
                    />
                }
            </View>
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={20}>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, alignSelf: 'center', color: COLORS.grey, fontSize: 15 }}
                        value={commentTxt}
                        placeholder={getTranslation("write_comment")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setCommentTxt(text)} />
                    <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center' }}
                        onPress={() => {
                            onSendComment()
                        }}>
                        <Image
                            style={{ height: 30, width: 30, alignSelf: 'center' }}
                            resizeMode='contain'
                            source={IMAGES.send} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    commentView: {
        marginHorizontal: 15,
        marginBottom: 5,
        marginTop: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3
    },
    inputView: {
        height: 44,
        backgroundColor: '#f7f7f7',
        borderRadius: 6,
        flexDirection: 'row',
        marginHorizontal: 25,
        marginTop: 9,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
})