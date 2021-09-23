import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, SafeAreaView, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';

//Components
import { Text, ProgressView, Header } from '../components';

//Context
import { AnalyticsContext } from '../context/AnalyticsProvider';
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

// COLORS & IMAGES
import { IMAGES, COLORS } from '../../assets'

//PACKAGES
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelectLanguage(props) {

    let [isLoading, setLoading] = useState(false);
    let [selectedLanguage, setSelectedLanguage] = useState(global.language);

    const { getTranslation, setI18nConfig, saveUserLanguage } = useContext(LocalizatiionContext);

    const onSelectLanguage = () => {
        if (selectedLanguage) {
            setLoading(true)
            setI18nConfig(selectedLanguage)
            saveUserLanguage(selectedLanguage)
            AsyncStorage.setItem('is_first_time_install', 'true')
            setLoading(false)
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Splash' }
                    ],
                })
            );
        }
        else {
            Alert.alert('', 'Please select a language', [{
                text: getTranslation('ok'), onPress: () => {
                    navigation.goBack()
                }
            }])
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <Header onBack={() => { props.navigation.goBack() }} />
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={IMAGES.login_img}
                        resizeMode='contain'
                    />
                    <Text
                        extraStyle={{ marginTop: 20 }}
                        size="22"
                        weight="600"
                        align='center'
                        color={COLORS.black}>
                        {getTranslation('select_language_title')}
                    </Text>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'en' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('en')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'ENGLISH'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'id' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('id')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'INDONESIAN'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'vi' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('vi')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'VIETNAMESE'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'ms' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('ms')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'MALAYSIAN'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'fil' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('fil')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'TAGALOG-PHILIPPINES'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.googleButton, {
                        borderColor: selectedLanguage == 'th' ? COLORS.orange : 'rgba(0,0,0,0.3)'
                    }]}
                        onPress={() => {
                            setSelectedLanguage('th')
                        }}>
                        <Text
                            extraStyle={{ alignSelf: 'center' }}
                            size="18"
                            weight="400"
                            align='center'
                            color={COLORS.darkGray}>
                            {'THAI'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.subscribeButton}
                onPress={() => {
                    onSelectLanguage()
                }}>
                <Text
                    extraStyle={{ alignSelf: 'center' }}
                    size="17"
                    weight="600"
                    align='center'
                    color={COLORS.white}>
                    {getTranslation('continue')}
                </Text>
            </TouchableOpacity>
            {isLoading && <ProgressView />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1.0,
        backgroundColor: COLORS.background
    },
    image: {
        height: 100,
        alignSelf: 'center'
    },
    googleButton: {
        flexDirection: 'row',
        height: 45,
        marginTop: 20,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        marginHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center'
    },
    googleIcon: {
        height: 25,
        width: 25,
        aspectRatio: 1,
        marginRight: 20,
        alignSelf: 'center'
    },
    subscribeButton: {
        width: '85%',
        height: 44,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
})
