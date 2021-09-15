import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

//Common Component
import { Text } from '../components';

//Packages
import { useTheme } from '@react-navigation/native';

/**
 * Button is Component to render app buttons
 * @property {Any} extraStyle - style as per parent view
 * @property {string} title - button title
 */

const Button = (props) => {

    const { colors, fonts } = useTheme();
    const styles = useStyles(colors, fonts)

    return (
        <TouchableOpacity
            {...props}
            style={[styles.container, props.extraStyle]}>
            <Label title={props.title} />
        </TouchableOpacity>
    )
}

const Label = (props) => {
    const { colors } = useTheme();
    return (
        <Text
            extraStyle={[{ marginLeft: 2, alignSelf: 'center' }]}
            size="17"
            weight="500"
            color={colors.backgroundDark}>
            {props.title}
        </Text>
    )
}

const useStyles = (colors, fonts) => StyleSheet.create({
    container: {
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: colors.primary,
        height: 50
    }
});

export default Button