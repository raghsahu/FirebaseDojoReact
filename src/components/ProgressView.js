import React, { useState, useEffect } from 'react'
import { View, Modal, ActivityIndicator } from 'react-native';

import { COLORS } from '../../assets';

//PACKAGES
import { useTheme } from '@react-navigation/native';
/**
 * ProgressView is Function Component to render indicator modal
 * @property {bool} visible - show modal
 */

const ProgressView = props => {
    return (
        <Modal visible={true} transparent={true}>
            <View style={{ flex: 1.0, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <ActivityIndicator
                    size='large'
                    animating={true}
                    color={COLORS.orange} />
            </View>
        </Modal>
    )
}

export default ProgressView;