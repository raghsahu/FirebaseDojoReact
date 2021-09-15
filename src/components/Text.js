import React from 'react';
import { Text as RNText } from 'react-native';

/**
 * Text is Component to render app text with custom font
 * @property {Any} extraStyle - style as per parent view
 * @property {string} color - text color
 * @property {string} align - text alignment
 * @property {string} weight - font weight 
 * @property {Any} size - font size 
 */


const Text = (props) => {
    return (
        <RNText
            {...props}
            style={[
                props.extraStyle,
                {
                    color: props.color,
                    textAlign: props.align,
                    fontWeight: props.weight,
                    fontSize: parseInt(props.size),
                    fontFamily: 'Poppins'
                },
            ]}>
            {props.children ? props.children : ''}
        </RNText>
    )
}


Text.defaultValue = {
    size: 14,
    weight: '400',
    color: '#fff',
};

export default Text;
