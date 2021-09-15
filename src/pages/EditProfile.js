import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

//Components
import { Header, Text as RNText, ProgressView } from '../components'

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function EditProfile({ navigation }) {
    const user = auth().currentUser;

    const { mixPanelEditProfile } = useContext(AnalyticsContext);

    const [isLoading, setLoading] = useState(true)
    const [firstname, setFirstName] = useState('')
    const [email, setEmail] = useState(user.email)

    useEffect(() => {
        firestore()
            .collection('users')
            .doc(user.email)
            .onSnapshot(documentSnapshot => {
                setLoading(false)
                let data = documentSnapshot.data()
                setFirstName(data.firstName)
            });
        return () => { }
    }, [])

    onSave = () => {
        mixPanelEditProfile({ "email": user.email })

        setLoading(true)
        firestore()
            .collection('users')
            .doc(user.email)
            .update({
                firstName: firstname,
                lastName: firstname,
            })
            .then(() => {
                setLoading(false);
                navigation.goBack()
            }).catch((error) => {
                alert(error.message)
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header onBack={() => {
                navigation.goBack()
            }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <RNText
                    extraStyle={{ marginHorizontal: 25, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {"Full Name"}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, alignSelf: 'center', color: COLORS.grey, fontSize: 15 }}
                        value={firstname}
                        placeholder={'Full Name'}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setFirstName(text)} />
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 25, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {"Email"}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ alignSelf: 'center', color: COLORS.grey, fontSize: 15 }}
                        value={email}
                        placeholder={'Email'}
                        editable={false}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setFirstName(text)} />
                </View>
                <TouchableOpacity style={styles.subscribeButton}
                    onPress={() => {
                        onSave()
                    }}>
                    <RNText
                        extraStyle={{ alignSelf: 'center' }}
                        size="17"
                        weight="600"
                        align='center'
                        color={COLORS.white}>
                        {'SAVE'}
                    </RNText>
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
    subscribeButton: {
        marginHorizontal: 25,
        height: 44,
        borderRadius: 6,
        backgroundColor: COLORS.orange,
        justifyContent: 'center',
        marginVertical: 50
    },
})
