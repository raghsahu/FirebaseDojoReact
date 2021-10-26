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

const Header = (props) => {

    const { colors, fonts } = useTheme();
    const styles = useStyles(colors, fonts)

    if (props.type && props.type == 'simple') {
        return (
            <View style={[styles.container, { marginHorizontal: 20 }]}>
                <BackLabel title={props.backTitle} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftItemsContainer}>
                {props.onMenu &&
                    <TouchableOpacity style={styles.backContainer}
                        onPress={props.onMenu}>
                        <Image style={styles.menu}
                            source={IMAGES.ic_menu}
                            resizeMode='contain' />
                    </TouchableOpacity>
                }
                {props.onBack &&
                    <TouchableOpacity style={styles.backContainer}
                        onPress={props.onBack}>
                        <Image style={styles.back}
                            source={IMAGES.ic_back}
                            resizeMode='contain' />
                    </TouchableOpacity>
                }
            </View>
            <View style={{ flex: 1.0, flexDirection: 'row' }}>
                {props.title && props.title != '' && <Label title={props.title} />}
                {props.backTitle != null && props.backTitle != '' && <BackLabel title={props.backTitle} />}
            </View>
            {props.onContent &&
                <View style={styles.leftItemsContainer}>

                    <TouchableOpacity
                        style={styles.searchContainer}
                        onPress={props.onContent}>
                        <Image style={styles.search}
                            source={IMAGES.content} />
                    </TouchableOpacity>
                </View>
            }
            {(props.onSearch || props.onClose || props.onNotification || props.onShare) &&
                <View style={styles.leftItemsContainer}>
                    {props.onSearch &&
                        <TouchableOpacity
                            style={styles.searchContainer}
                            onPress={props.onSearch}>
                            <Image style={styles.search}
                                source={IMAGES.ic_search} />
                        </TouchableOpacity>
                    }
                    {props.onClose &&
                        <TouchableOpacity
                            style={styles.searchContainer}
                            onPress={props.onClose}>
                            <Image style={styles.search}
                                source={IMAGES.close} />
                        </TouchableOpacity>
                    }
                    {props.onNotification &&
                        <TouchableOpacity
                            style={styles.searchContainer}
                            onPress={props.onNotification}>
                            <Image style={styles.search}
                                source={IMAGES.ic_notification} />
                        </TouchableOpacity>
                    }
                    {props.onShare &&
                        <TouchableOpacity
                            style={styles.searchContainer}
                            onPress={props.onShare}>
                            <Image style={styles.search}
                                source={IMAGES.share} />
                        </TouchableOpacity>
                    }
                </View>
            }
        </View>
    )
}

const Label = (props) => {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1.0, flexDirection: 'row' }}>
            <Text
                extraStyle={{ flex: 1.0, alignSelf: 'center' }}
                size="22"
                weight="600"
                ellipsizeMode='tail'
                numberOfLines={1}
                color={COLORS.darkGray}>
                {props.title}
            </Text>
        </View>
    )
}

const BackLabel = (props) => {
    const { colors } = useTheme();
    return (
        <Text
            extraStyle={{ flex: 1.0, alignSelf: 'center' }}
            size="22"
            weight="600"
            ellipsizeMode='tail'
            numberOfLines={1}
            color={COLORS.darkGray}>
            {props.title}
        </Text>
    )
}

const useStyles = (colors, fonts) => StyleSheet.create({
    container: {
        height: Platform.OS == 'ios' ? 44 : 54,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 12,
        backgroundColor: COLORS.background
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
    menu: {
        height: 25,
        width: 25,
        alignSelf: 'center'
    },
    back: {
        height: 40,
        width: 40,
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

export default Header