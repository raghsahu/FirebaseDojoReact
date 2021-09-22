import React, { useContext } from 'react';
import { View, StatusBar, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

//Components
import { Header, Text, BookItem } from '../components'

//IMAGES & COLORS
import { IMAGES, COLORS } from '../../assets'

//CONTEXT
import { LocalizatiionContext } from '../context/LocalizatiionProvider';

//PACKAGES
import auth from '@react-native-firebase/auth';

export default function Menu({ navigation, onPressItem }) {
    const user = auth().currentUser;

    const { getTranslation } = useContext(LocalizatiionContext);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                    extraStyle={{ marginTop: 20, marginLeft: 20 }}
                    size="22"
                    weight="600"
                    color={COLORS.black}>
                    {getTranslation('welcome_to')}
                    <Text
                        extraStyle={{ marginTop: 40 }}
                        size="22"
                        weight="600"
                        color={COLORS.orange}>
                        {" " + getTranslation('dojo')}
                    </Text>
                </Text>
                <View style={styles.devider} />
                <View style={styles.profileView}>
                    <Image style={styles.profileIcon} source={IMAGES.ic_settings} />
                    <Text
                        extraStyle={{ flex: 1.0, marginLeft: 10, marginRight: 2 }}
                        size="20"
                        weight="600"
                        color={COLORS.black}>
                        {getTranslation('profile_settings')}
                    </Text>
                </View>
                <View style={{ height: 20 }} />
                <Text
                    onPress={() => {
                        onPressItem('edit')
                    }}
                    extraStyle={{ marginLeft: 20, marginBottom: 10 }}
                    size="18"
                    weight="400"
                    color={COLORS.black}>
                    {getTranslation('edit_profile')}
                </Text>
                <View style={styles.singleDevider} />
                <Text
                    onPress={() => {
                        onPressItem('subscription')
                    }}
                    extraStyle={{ marginLeft: 20, marginVertical: 10 }}
                    size="18"
                    weight="400"
                    color={COLORS.black}>
                    {getTranslation('my_subscription')}
                </Text>
                <View style={styles.singleDevider} />
                <Text
                    onPress={() => {
                        onPressItem('language')
                    }}
                    extraStyle={{ marginLeft: 20, marginVertical: 10 }}
                    size="18"
                    weight="400"
                    color={COLORS.black}>
                    {getTranslation('Language')}
                </Text>
                <View style={styles.singleDevider} />
                <Text
                    onPress={() => {
                        onPressItem('feed_back')
                    }}
                    extraStyle={{ marginLeft: 20, marginVertical: 10 }}
                    size="18"
                    weight="400"
                    color={COLORS.black}>
                    {getTranslation('feed_back')}
                </Text>
                <View style={styles.singleDevider} />
                <Text
                    onPress={() => {
                        onPressItem('privacy_policy')
                    }}
                    extraStyle={{ marginLeft: 20, marginTop: 10 }}
                    size="18"
                    weight="400"
                    color={COLORS.black}>
                    {getTranslation('privacy_policy')}
                </Text>
                <View style={styles.devider} />
                <TouchableOpacity style={styles.profileView}
                    onPress={() => {
                        onPressItem('refer_friend')
                    }}>
                    <Image style={styles.profileIcon} source={IMAGES.ic_redeem} />
                    <Text
                        extraStyle={{ flex: 1.0, marginLeft: 10, marginRight: 2 }}
                        size="20"
                        weight="600"
                        color={COLORS.black}>
                        {getTranslation('refer_a_Friend')}
                    </Text>
                </TouchableOpacity>
                <View style={styles.devider} />
                <TouchableOpacity style={styles.profileView}
                    onPress={() => {
                        onPressItem('my_review')
                    }}>
                    <Image style={styles.profileIcon} source={IMAGES.ic_referal} />
                    <Text
                        extraStyle={{ flex: 1.0, marginLeft: 10, marginRight: 2 }}
                        size="20"
                        weight="600"
                        color={COLORS.black}>
                        {getTranslation('my_reviews')}
                    </Text>
                </TouchableOpacity>
                <View style={styles.devider} />
                <TouchableOpacity style={styles.profileView} onPress={() => {
                    Alert.alert('', getTranslation('logout_message'), [
                        { text: getTranslation('No'), onPress: () => { } },
                        {
                            text: getTranslation('Yes'), onPress: () => {
                                auth().signOut()
                            }
                        }
                    ])
                }}>
                    <Image style={styles.profileIcon} source={IMAGES.ic_logout} />
                    <Text
                        extraStyle={{ marginLeft: 10 }}
                        size="20"
                        weight="600"
                        color={COLORS.black}>
                        {getTranslation('Logout')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    devider: {
        backgroundColor: '#e5e5e5',
        height: 5,
        marginVertical: 20
    },
    profileView: {
        flexDirection: 'row'
    },
    profileIcon: {
        height: 25,
        width: 25,
        marginLeft: 20,
        alignSelf: 'center'
    },
    singleDevider: {
        backgroundColor: '#e5e5e5',
        height: 1,
        marginVertical: 5,
        marginLeft: 20
    },
})
