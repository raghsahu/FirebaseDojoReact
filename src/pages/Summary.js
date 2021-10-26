import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, View, StatusBar, SafeAreaView, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

//Components
import { Header, HomeBookItem } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast';

export default function Summary({ navigation }) {

    const { getTranslation } = useContext(LocalizatiionContext);

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getAllBooks()
    }, [])

    getAllBooks = async () => {        
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
        setBooks(list)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header type={'simple'} backTitle={getTranslation('summary')} />
            {isLoading ?
                <View style={{ height: 100, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
                </View>
                :
                <View style={styles.container}>
                    <FlatList
                        data={books}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => { return (<View style={{ height: 20 }} />) }}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item, index }) =>
                            <View style={styles.cell}>
                                <View style={styles.cellShadow}>
                                    <HomeBookItem item={item} index={index}
                                        onPress={(item) =>
                                            navigation.navigate('Detail', {
                                                item: item
                                            })
                                        } />
                                </View>
                            </View>
                        }
                    />
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
    cell: {
        width: Dimensions.get('window').width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    cellShadow: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3,
        padding: 10,
        backgroundColor: '#fff'
    }
})