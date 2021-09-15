import React, { useState } from 'react';
import { Platform, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

//Assets
import { IMAGES, COLORS } from '../../assets'

//Common Component
import { Text } from '../components';

//Packages
import { useTheme } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';

/**
 * Header is Component to render app top header/navigation bar
 * @property {string} title - button title
 */

const HomeBookItem = (props) => {

    const { colors, fonts } = useTheme();
    const styles = useStyles(colors, fonts)

    const { item, index } = props
    return (
        <TouchableOpacity style={styles.container} onPress={() => props.onPress(item)}>
            <View style={styles.imgView}>
                {item.images && item.images.length > 0 && item.images[0].url &&
                    <Image style={{ flex: 1.0 }}
                        resizeMode='cover'
                        source={item.images[0].url ? { uri: item.images[0].url } : null} />
                }
            </View>
            <Text
                extraStyle={{ flex: 1.0, marginTop: 10 }}
                size="16"
                weight="400"
                numberOfLines={1}
                color={COLORS.darkGray}>
                {item.bookName}
            </Text>
            <Text
                extraStyle={{ flex: 1.0, marginTop: 4 }}
                size="12"
                weight="400"
                numberOfLines={1}
                color={COLORS.darkGray}>
                {item.description}
            </Text>
            <View style={{ marginTop: 8 }} >
                <Rating
                    type={'custom'}
                    disabled={true}
                    count={5}
                    ratingColor={COLORS.orange}
                    readonly={true}
                    imageSize={16}
                    startingValue={item.numberOfStars}
                    style={{ alignSelf: 'flex-start' }}
                />
            </View>
        </TouchableOpacity>
    )
}


const useStyles = (colors, fonts) => StyleSheet.create({
    container: {
        width: 139,
    },
    imgView: {
        height: 155,
        width: 139,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        overflow: 'hidden'
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

export default HomeBookItem