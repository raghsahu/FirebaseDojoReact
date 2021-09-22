import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'

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

    const [downloadURL, setURL] = useState('')
    const { getTranslation } = useContext(LocalizatiionContext);

    useEffect(async () => {
        const name = getFileName()
        const url = await storage().ref(`/privacy_policy/${name}`).getDownloadURL();
        setURL(url)
    })

    const getFileName = () => {
        if (global.language == 'en') {
            return 'privacy_english.docx'
        }
        else if (global.language == 'fil') {
            return 'privacy_phillipines.docx'
        }
        else if (global.language == 'id') {
            return 'privacy_indonesian.docx'
        }
        else if (global.language == 'ms') {
            return 'privacy_malay.docx'
        }
        else if (global.language == 'th') {
            return 'privacy_thai.docx'
        }
        else if (global.language == 'vi') {
            return 'privacy_viernamese.docx'
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header title={getTranslation('privacy_policy')} onBack={() => navigation.goBack()} />
            {downloadURL ?
                <WebView style={{
                    flex: 1.0, backgroundColor: COLORS.background,
                }}
                    source={{ uri: downloadURL }} />
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