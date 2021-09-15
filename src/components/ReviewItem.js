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

const ReviewItem = (props) => {

    const { colors, fonts } = useTheme();
    const styles = useStyles(colors, fonts)

    const { item, index } = props
    return (
        <TouchableOpacity style={styles.container} onPress={() => props.onPress(item)}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.imgView}>
                    {item.book && item.book.images && item.book.images.length > 0 && item.book.images[0].url &&
                        <Image style={{ flex: 1.0 }}
                            resizeMode='cover'
                            source={item.book.images[0].url ? { uri: item.book.images[0].url } : null} />
                    }
                </View>
                <View style={{ flex: 1.0 }}>
                    <Text
                        extraStyle={{ marginLeft: 10, marginRight: 40, marginTop: 0 }}
                        size="16"
                        weight="400"
                        numberOfLines={1}
                        color={COLORS.darkGray}>
                        {item.book ? item.book.bookName : ''}
                    </Text>
                    <Text
                        extraStyle={{ marginHorizontal: 10, marginTop: 5 }}
                        size="12"
                        weight="400"
                        numberOfLines={1}
                        color={COLORS.darkGray}>
                        {item.book ? item.book.description : ''}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' }}>
                <View>
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="12"
                        weight="400"
                        numberOfLines={2}
                        align='center'
                        color={COLORS.darkGray}>
                        {'Quality\nof book'}
                    </Text>
                    <View>
                        <Rating
                            type={'custom'}
                            disabled={true}
                            count={5}
                            ratingColor={COLORS.orange}
                            readonly={true}
                            imageSize={16}
                            startingValue={item.bookrating}
                            style={{ alignSelf: 'center', marginTop: 4 }}
                        />
                    </View>
                </View>
                <View>
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="12"
                        weight="400"
                        numberOfLines={2}
                        align='center'
                        color={COLORS.darkGray}>
                        {'Quality\nof summary'}
                    </Text>
                    <View>
                        <Rating
                            type={'custom'}
                            disabled={true}
                            count={5}
                            ratingColor={COLORS.orange}
                            readonly={true}
                            imageSize={16}
                            startingValue={item.summaryrating}
                            style={{ alignSelf: 'center', marginTop: 4 }}
                        />
                    </View>
                </View>
                <View>
                    <Text
                        extraStyle={{ alignSelf: 'center' }}
                        size="12"
                        weight="400"
                        numberOfLines={2}
                        align='center'
                        color={COLORS.darkGray}>
                        {'Quality\nof infographics'}
                    </Text>
                    <View>
                        <Rating
                            type={'custom'}
                            disabled={true}
                            count={5}
                            ratingColor={COLORS.orange}
                            readonly={true}
                            imageSize={16}
                            startingValue={item.infograficrating}
                            style={{ alignSelf: 'center', marginTop: 4 }}
                        />
                    </View>
                </View>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 3
    },
    imgView: {
        height: 50,
        width: 50,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10
    },
    likeButton: {
        height: 40,
        width: 40,
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    likeImage: {
        height: 20,
        width: 20,
        alignSelf: 'center'
    }
});

export default ReviewItem