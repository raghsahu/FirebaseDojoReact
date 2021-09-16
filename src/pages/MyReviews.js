import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

//Components
import { Header, Text as RNText, ReviewItem } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function MyReview({ navigation }) {
    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);

    const [isLoading, setLoading] = useState(true)
    const [isError, setError] = useState('')
    const [reviews, setReviews] = useState([]);

    useEffect(async () => {
        getMyReviews()
        return () => { }
    }, [])

    const getMyReviews = async() => {
        try {
            const reviews = await firestore()
                .collection('userRating')
                .doc(user.email)
                .collection('books')
                .get()
            var list = []
            reviews.forEach(documentSnapshot => {
                var data = documentSnapshot.data()
                data.id = documentSnapshot.id
                console.log(data.id)
                list.push(data)
            });
            console.log(reviews)
            setLoading(false)
            if (list.length == 0) {
                setError(getTranslation('no_review_available_yet'))
            }
            else {
                setError('')
            }
            list.reverse()
            setReviews(list)
        }
        catch (e) {
            setLoading(false)
            setReviews([])
            setError(getTranslation('no_review_available_yet'))
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header backTitle={getTranslation('my_reviews')} onBack={() => {
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
                            {reviews && reviews.length > 0 &&
                                <View style={styles.container}>
                                    <FlatList
                                        style={{ marginVertical: 20 }}
                                        data={reviews}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id.toString() + index.toString()}
                                        renderItem={({ item, index }) =>
                                            <ReviewItem
                                                item={item}
                                                index={index}
                                                onPress={(item) =>
                                                    navigation.navigate('Detail', {
                                                        item: item.book
                                                    })
                                                } />
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
