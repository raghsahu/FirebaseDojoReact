import React, { createContext, useState, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import { Mixpanel } from 'mixpanel-react-native';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = (props) => {

    const user = auth().currentUser;
    const mixpanel = new Mixpanel("527ef3195732c9dd30c914a9a3f8089f");

    useEffect(() => {
        mixpanel.init();
        mixpanel.optInTracking();
        mixpanel.setLoggingEnabled(true);
        return () => { }
    }, [])

    const mixPanelSignin = (googleUser) => {
        mixpanel.identify(googleUser.email);
        mixpanel.getPeople().set("email", googleUser.email)
        mixpanel.getPeople().set("name", googleUser.displayName)
        mixpanel.track('SiginIn', { "email": googleUser.email })
    }

    const mixPanelOpenBookDetails = async (obj) => {
        mixpanel.track('OpenBookDetails', obj)
    }

    const mixPanelRateBook = async (obj) => {
        mixpanel.track('RateBook', obj)
    }

    const mixPanelInAppRating = async (obj) => {
        mixpanel.track('InAppRating', obj)
    }

    const mixPanelEditProfile = async (obj) => {
        mixpanel.track('EditProfile', obj)
    }

    const mixPanelOnSubscribe = async (obj) => {
        mixpanel.track('OnClickSubscribeNow', obj)
    }

    const mixPanelOnClickPurchase = async (obj) => {
        mixpanel.track('OnClickPurchase', obj)
    }

    const mixPanelOnSubscriptionComplete = async (obj) => {
        mixpanel.track('OnSubscriptionComplete', obj)
    }

    const mixPanelOnLanguageChoose = async (obj) => {
        mixpanel.track('OnSelectLanguage', obj)
    }

    return (
        <AnalyticsContext.Provider
            value={{
                mixPanelSignin,
                mixPanelRateBook,
                mixPanelInAppRating,
                mixPanelOpenBookDetails,
                mixPanelEditProfile,
                mixPanelOnSubscribe,
                mixPanelOnClickPurchase,
                mixPanelOnSubscriptionComplete,
                mixPanelOnLanguageChoose
            }}>
            {props.children}
        </AnalyticsContext.Provider>
    )
}
