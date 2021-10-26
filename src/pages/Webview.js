import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView, Platform, Linking } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import storage from '@react-native-firebase/storage';
import WebView from 'react-native-webview';

export default function WebviewController({ route, navigation }) {
    const isFromLogin = route.params.isFromLogin
    const [downloadURL, setURL] = useState('')
    const { getTranslation } = useContext(LocalizatiionContext);

    useEffect(async () => {
        const url = getFileName()
        // const url = await storage().ref(`/privacy_policy/${name}`).getDownloadURL();
        if (Platform.OS == 'ios') {
            setURL(url)
        }
        else {
            navigation.goBack()
            Linking.openURL(url)
        }
    })

    const getFileName = () => {
        if (global.language == 'en') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_english.docx?alt=media&token=e60a7ddc-5ac4-43ea-98e5-33e4d0fbf9b0'
        }
        else if (global.language == 'fil') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_phillipines.docx?alt=media&token=083d5f83-a292-4e1f-b3b6-b335eed05d15'
        }
        else if (global.language == 'id') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_indonesian.docx?alt=media&token=bf9ac39c-3733-4340-85bb-ecf684a4584f'
        }
        else if (global.language == 'ms') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_malay.docx?alt=media&token=c9a28eb3-584f-4e36-a604-69a8dadc9e53'
        }
        else if (global.language == 'th') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_thai.docx?alt=media&token=2c0e1cda-31d1-418d-b7ab-ff85cb9dc36c'
        }
        else if (global.language == 'vi') {
            return 'https://firebasestorage.googleapis.com/v0/b/dojo-cc7f6.appspot.com/o/privacy_policy%2Fprivacy_viernamese.docx?alt=media&token=89484655-264b-4b50-beee-42167c83b05c'
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header title={isFromLogin ? getTranslation('Terms and Conditions') : getTranslation('privacy_policy')} onBack={() => navigation.goBack()} />
            {downloadURL ?
                <View style={{ flex: 1.0 }}>
                    {Platform.OS == 'ios' ?
                        <WebView style={{
                            flex: 1.0, backgroundColor: COLORS.background,
                        }}
                            source={{ uri: downloadURL }}
                            startInLoadingState={true} />
                        :
                        <View style={{ flex: 1.0 }}>
                            <WebView style={{
                                flex: 1.0, backgroundColor: COLORS.background,
                            }}
                                source={{ uri: `file://${downloadURL}` }}
                                allowFileAccess={true}
                                allowFileAccessFromFileURLs={true}
                                allowingReadAccessToURL={true} />
                        </View>
                    }
                </View>
                :
                <View style={{ height: 100, justifyContent: 'center' }}>
                    <ActivityIndicator style={{ alignSelf: 'center' }} animating={true} color={COLORS.orange} />
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
})