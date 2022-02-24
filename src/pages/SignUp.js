import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform, TextInput } from 'react-native';

//Components
import { Text as RNText, ProgressView, Header } from '../components';

//Context
import { APPContext } from '../context/AppProvider';
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

// COLORS & IMAGES
import { IMAGES, COLORS } from '../../assets'
import { ScrollView } from 'react-native-gesture-handler';

//PACKAGES
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import pkg from '../../package.json';
import { CommonActions } from '@react-navigation/native';

export default function SignUp(props) {

    const user = auth().currentUser;

    const { getSubscriptionDetails } = useContext(APPContext);

    const [isLoading, setLoading] = useState(false)
    const [firstname, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('male')
    const [city, setCity] = useState('')
    const [age, setAge] = useState('')
    const [job, setJob] = useState('')

    const { mixPanelSignUp } = useContext(AnalyticsContext);
    const { getTranslation } = useContext(LocalizatiionContext);

    useEffect(() => {
        setTimeout(() => {
            setEmail(user.email)
            setFirstName(user.displayName)
        }, 200);
    }, [])

    function onNext() {
        if (!city) {
            Toast.show(getTranslation('please enter city'));
        } else if (!age) {
            Toast.show(getTranslation('please enter age'));
        } else if (!job) {
            Toast.show(getTranslation('please enter job'));
        } else {
            firestore()
                .collection('users')
                .doc(user.email)
                .set({
                    email: user.email,
                    firstName: user.displayName,
                    lastName: user.displayName,
                    dateAdded: firestore.FieldValue.serverTimestamp(),
                    dateUpdated: firestore.FieldValue.serverTimestamp(),
                    version: pkg.version,
                    platform: Platform.OS,
                    referral_code: makeid(10),
                    city: city,
                    age: age,
                    job: job
                })
                .then(() => {
                    setLoading(false)
                    getSubscription()
                }).catch((error) => {
                    console.log(error)
                });
        }
    }

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const getSubscription = () => {
        getSubscriptionDetails((finished) => {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'ReferralCode' }
                    ],
                })
            );
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header type={'back'} backTitle={getTranslation('Sign Up')}
                onBack={() => { props.navigation.goBack() }} />
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {Platform.OS == 'android' &&
                        <>
                            <RNText
                                extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                                size={"14"}
                                weight="400"
                                color={'#000'}>
                                {getTranslation("email_address")}
                            </RNText>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                                    value={email}
                                    placeholder={getTranslation("email_address")}
                                    placeholderTextColor={COLORS.grey}
                                    editable={false}
                                    onChangeText={(text) => setEmail(text)} />
                            </View>
                        </>
                    }
                    <RNText
                        extraStyle={{ marginHorizontal: 28, marginTop: 15 }}
                        size={"14"}
                        weight="400"
                        color={'#000'}>
                        {getTranslation("full_name")}
                    </RNText>
                    <View style={styles.inputView}>
                        <TextInput
                            style={{ flex: 1.0, color: COLORS.grey, fontSize: 15 }}
                            value={firstname}
                            editable={false}
                            placeholder={getTranslation("full_name")}
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
                            setLoading(true)
                            onNext()
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
                </View>
            </ScrollView>
            {isLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        backgroundColor: COLORS.background,
        flexDirection: 'column'
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
