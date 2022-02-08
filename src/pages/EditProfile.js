import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, ScrollView, Alert, StyleSheet, TouchableOpacity, Image, TextInput, ToastAndroid } from 'react-native';

//Components
import { Header, Text as RNText, ProgressView } from '../components'

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';


export default function EditProfile({ navigation }) {
    const user = auth().currentUser;

    const { mixPanelEditProfile } = useContext(AnalyticsContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    const [isLoading, setLoading] = useState(true)
    const [firstname, setFirstName] = useState('')
    const [email, setEmail] = useState(user.email)
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [city, setCity] = useState('')
    const [job, setJob] = useState('')

    useEffect(() => {
        console.log('user======>', JSON.stringify(user))
        try {
            firestore()
                .collection('users')
                .doc(user.email)
                .onSnapshot(documentSnapshot => {
                    setLoading(false)
                    let data = documentSnapshot.data()
                    setFirstName(data.firstName)
                    setGender(data.gender)
                    setCity(data.city)
                    setAge(data.age)
                    setJob(data.job)
                    console.log('documentSnapshot', documentSnapshot)

                })
        }
        catch (e) {
            Alert.alert('', e.message, [{
                text: getTranslation('ok'), onPress: () => {

                }
            }])
        }
        return () => { }
    }, [])

    onSave = () => {
        if (!gender) {
            Toast.show('please select gender')
        } else if (!city) {
            Toast.show(getTranslation('please enter city'));
        } else if (!age) {
            Toast.show(getTranslation('please enter age'));
        } else if (!job) {
            Toast.show(getTranslation('please enter job'));
        } else {
            mixPanelEditProfile({ "email": user.email })

            setLoading(true)
            firestore()
                .collection('users')
                .doc(user.email)
                .update({
                    email: user.email,
                    firstName: firstname,
                    lastName: firstname,
                    gender: gender,
                    city: city,
                    age: age,
                    job: job                    
                })
                .then(() => {
                    setLoading(false);
                    navigation.goBack()
                }).catch((error) => {
                    Alert.alert('', error.message, [{
                        text: getTranslation('ok'), onPress: () => {

                        }
                    }])
                });
        }

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
                    {getTranslation("full_name")}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                        value={firstname}
                        placeholder={getTranslation("full_name")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setFirstName(text)} />
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 25, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {getTranslation("email")}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                        value={email}
                        placeholder={getTranslation("email")}
                        editable={false}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setFirstName(text)} />
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {getTranslation("gender")}
                </RNText>
                <View style={{ flexDirection: 'row', marginTop: 9, flex: 1.0, marginHorizontal: 25 }}>
                    <TouchableOpacity style={{ flex: 1.0, height: 30, marginRight: 16, flexDirection: 'row' }}
                        onPress={() => { setGender('male') }}>
                        <Image style={{ height: 25, width: 25, tintColor: COLORS.orange }} resizeMode='contain' source={gender == 'male' ? IMAGES.radio_fill : IMAGES.radio_unfill} />
                        <RNText
                            extraStyle={{ marginHorizontal: 8, marginTop: 3 }}
                            size={"14"}
                            weight="400"
                            color={'#000'}>
                            {getTranslation("male")}
                        </RNText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1.0, height: 30, marginLeft: 16, flexDirection: 'row' }}
                        onPress={() => { setGender('female') }}>
                        <Image style={{ height: 25, width: 25, tintColor: COLORS.orange }} resizeMode='contain' source={gender == 'female' ? IMAGES.radio_fill : IMAGES.radio_unfill} />
                        <RNText
                            extraStyle={{ marginHorizontal: 8, marginTop: 3 }}
                            size={"14"}
                            weight="400"
                            color={'#000'}>
                            {getTranslation("female")}
                        </RNText>
                    </TouchableOpacity>
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {getTranslation("city")}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                        value={city}
                        placeholder={getTranslation("city")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setCity(text)} />
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {getTranslation("age")}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                        value={age}
                        editable={true}
                        placeholder={getTranslation("age")}
                        keyboardType='numeric'
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setAge(text)} />
                </View>
                <RNText
                    extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                    size={"14"}
                    weight="400"
                    color={'#000'}>
                    {getTranslation("jon")}
                </RNText>
                <View style={styles.inputView}>
                    <TextInput
                        style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                        value={job}
                        placeholder={getTranslation("jon")}
                        placeholderTextColor={COLORS.grey}
                        onChangeText={(text) => setJob(text)} />
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
                        {getTranslation('SAVE')}
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
        height: 46,
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
