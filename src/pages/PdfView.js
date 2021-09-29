import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, StatusBar, SafeAreaView, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';

//Components
import { Header, Text, NotificationItem, ProgressView } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import Pdf from 'react-native-pdf';

export default function PdfView({ route, navigation }) {

    const item = route.params.item

    useEffect(async () => {
        console.log(item.book_file)
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <Pdf
                    source={{ uri: item.book_file, cache: false }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages, filePath}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})
