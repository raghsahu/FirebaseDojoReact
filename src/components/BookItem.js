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

const BookItem = (props) => {
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
            <View style={{ flex: 1.0 }}>
                <TouchableOpacity style={styles.likeButton}
                    onPress={() => {
                        props.onLike(item)
                    }}>
                    {props.isLiked ?
                        <Image style={styles.likeImage}
                            source={IMAGES.ic_like_selected}
                            resizeMode='contain' />
                        :
                        <Image style={styles.likeImage}
                            source={IMAGES.ic_like}
                            resizeMode='contain' />
                    }

                </TouchableOpacity>
                <Text
                    extraStyle={{ marginLeft: 10, marginRight: 40, marginTop: -20 }}
                    size="16"
                    weight="400"
                    numberOfLines={1}
                    color={COLORS.darkGray}>
                    {item.bookName}
                </Text>
                <Text
                    extraStyle={{ marginHorizontal: 10, marginTop: 5 }}
                    size="12"
                    weight="400"
                    numberOfLines={1}
                    color={COLORS.darkGray}>
                    {item.description}
                </Text>
                <View style={{ marginLeft: 10, marginTop: 8 }} >
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
        height: 120,
        width: 100,
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

export default BookItem
