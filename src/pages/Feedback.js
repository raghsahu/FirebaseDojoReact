import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'

//Components
import { Header, Text, ProgressView } from '../components'

//Context
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Feedback({ route, navigation }) {
    const user = auth().currentUser;

    const [isLoading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')

    const { getTranslation } = useContext(LocalizatiionContext);

    const onSubmit = () => {
        if (title.trim() && message.trim()) {
            setLoading(true)
            firestore()
                .collection('supports')
                .doc(user.email)
                .set({
                    title: title,
                    message: message
                }).then(() => {
                    setLoading(false)
                    Alert.alert('', getTranslation('Your feedback submitted succesfully'), [{
                        text: getTranslation('ok'), onPress: () => {
                            navigation.goBack()
                        }
                    }])
                }).catch((err) => {
                    Alert.alert('', err.message)
                })
        }
        else {
            Alert.alert('', getTranslation('Please enter title and message'))
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header title={getTranslation('feed_back')} onBack={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ height: 30 }} />
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, alignSelf: 'center', color: COLORS.grey, fontSize: 15 }}
                        value={title}
                        placeholder={getTranslation("title")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setTitle(text)} />
                </View>
                <View style={{ height: 10 }} />
                <View style={styles.messageView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15, textAlignVertical: 'top' }}
                        multiline={true}
                        value={message}
                        placeholder={getTranslation("write_message")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setMessage(text)} />
                </View>
                <TouchableOpacity style={styles.subscribeButton}
                    onPress={() => {
                        onSubmit()
                    }}>
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="17"
                        weight="600"
                        align='center'
                        color={COLORS.white}>
                        {getTranslation('submit')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            {isLoading && <ProgressView />}
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    messageView: {
        height: 120,
        backgroundColor: '#f7f7f7',
        borderRadius: 6,
        flexDirection: 'row',
        marginHorizontal: 25,
        marginTop: 9,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    subscribeButton: {
        marginHorizontal: 25,
        height: 44,
        borderRadius: 6,
        backgroundColor: COLORS.orange,
        justifyContent: 'center',
        marginVertical: 50
    },
})
