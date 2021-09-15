import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';

//Assets
import { IMAGES, COLORS } from '../../assets'

/**
 * Tabbar is component to render app bottom bar
 */

const Tabbar = (props) => {

    return (
        <View style={{
            backgroundColor: '#fff',
        }}>
            <View style={styles.container}>
                <View style={styles.itemsContainers}>
                    {props.state.routes.map((route, index) => {
                        return (
                            <TabItem
                                key={index}
                                route={route}
                                index={index}
                                selected={props.state.index === index}
                                navigation={props.navigation} />
                        )
                    })}
                </View>
            </View>
            <SafeAreaView />
        </View>
    )
}

const TabItem = (props) => {

    const onPress = () => {
        const event = props.navigation.emit({
            type: 'tabPress',
            target: props.route.key,
            canPreventDefault: true,
        });

        if (!props.selected && !event.defaultPrevented) {
            props.navigation.navigate(props.route.name);
        }
    };

    console.log(props.route)
    return (
        <TouchableOpacity
            style={styles.tabItem}
            onPress={onPress}
            key={props.index}>
            <View style={[styles.tabItem]}>
                <View style={{ alignSelf: 'center' }}>
                    <Image
                        style={[styles.tabIcon, {
                            tintColor: props.selected ? COLORS.orange : COLORS.darkGray
                        }]}
                        source={tabImages[props.index]} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const tabImages = [IMAGES.ic_tab_home, IMAGES.ic_tab_discover, IMAGES.ic_tab_library, IMAGES.ic_tab_summary]

const styles = StyleSheet.create({
    container: {
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowOpacity: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: -3 },
        shadowRadius: 2
    },
    itemsContainers: {
        flex: 1.0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: '100%',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center'
    },
    tabIcon: {
        height: 20,
        width: 20,
        alignSelf: 'center'
    }
});

export default Tabbar