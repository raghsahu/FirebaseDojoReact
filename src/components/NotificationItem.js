import React, { useState } from 'react';
import { Platform, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

//Assets
import { IMAGES, COLORS } from '../../assets'

//Common Component
import { Text } from '../components';

//Packages
import { useTheme } from '@react-navigation/native';

/**
 * Header is Component to render app top header/navigation bar
 * @property {string} title - button title
 */

const NotificationItem = (props) => {

    const { colors, fonts } = useTheme();
    const styles = useStyles(colors, fonts)

    const { item, index } = props
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <View style={styles.imgView}>
                {item.image && item.image &&
                    <Image style={{ flex: 1.0 }}
                        source={item.image ? { uri: item.image } : null} />
                }
            </View>
            <View style={{ flex: 1.0 }}>
                <Text
                    extraStyle={{ flex: 1.0, marginHorizontal: 10 }}
                    size="16"
                    weight="400"
                    numberOfLines={2}
                    color={COLORS.darkGray}>
                    {item.description}
                </Text>
                <Text
                    extraStyle={{ marginHorizontal: 10 }}
                    size="12"
                    weight="300"
                    align='right'
                    numberOfLines={2}
                    color={COLORS.darkGray}>
                    {item.dateAdded}
                </Text>
            </View>
        </TouchableOpacity>
    )
}


const useStyles = (colors, fonts) => StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginBottom: 5,
        marginTop: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3
    },
    imgView: {
        height: 67,
        width: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10
    },
    leftItemsContainer: {
        flexDirection: 'row',
        aspectRatio: 1,
    },
    backContainer: {
        alignSelf: 'center',
        height: 40,
        width: 40,
        justifyContent: 'center',
    },
    back: {
        height: 25,
        width: 25,
        alignSelf: 'center'
    },
    searchContainer: {
        alignSelf: 'center',
        height: 40,
        width: 40,
        justifyContent: 'center',
    },
    search: {
        height: 25,
        width: 25,
        alignSelf: 'center'
    }
});

export default NotificationItem