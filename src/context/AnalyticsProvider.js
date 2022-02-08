import React, { createContext, useState, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import { Mixpanel } from 'mixpanel-react-native';
import analytics from '@react-native-firebase/analytics';

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
        analytics().logEvent('SiginIn', { "email": googleUser.email })
    }

    const mixPanelSignUp = async (obj) => {
        mixpanel.track('SignUpDetails', obj)
        analytics().logEvent('SignUpDetails', obj)
    }

    const mixPanelOpenBookDetails = async (obj) => {
        mixpanel.track('OpenBookDetails', obj)
        analytics().logEvent('OpenBookDetails', obj)
    }

    const mixPanelRateBook = async (obj) => {
        mixpanel.track('RateBook', obj)
        analytics().logEvent('RateBook', obj)
    }

    const mixPanelInAppRating = async (obj) => {
        mixpanel.track('InAppRating', obj)
        analytics().logEvent('InAppRating', obj)
    }

    const mixPanelEditProfile = async (obj) => {
        mixpanel.track('EditProfile', obj)
        analytics().logEvent('EditProfile', obj)
    }

    const mixPanelOnSubscribe = async (obj) => {
        mixpanel.track('OnClickSubscribeNow', obj)
        analytics().logEvent('OnClickSubscribeNow', obj)
    }

    const mixPanelOnClickPurchase = async (obj) => {
        mixpanel.track('OnClickPurchase', obj)
        analytics().logEvent('OnClickPurchase', obj)
    }

    const mixPanelOnSubscriptionComplete = async (obj) => {
        mixpanel.track('OnSubscriptionComplete', obj)
        analytics().logEvent('OnSubscriptionComplete', obj)
    }

    const mixPanelOnLanguageChoose = async (obj) => {
        mixpanel.track('OnSelectLanguage', obj)
        analytics().logEvent('OnSelectLanguage', obj)
    }

    const mixPanelOnReferAFriend = async (obj) => {
        mixpanel.track('ReferFriend', obj)
        analytics().logEvent('ReferFriend', obj)
    }

    const mixPanelOnBookEndReading = async (obj) => {
        mixpanel.track('OnBookEndReading', obj)
        analytics().logEvent('OnBookEndReading', obj)
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
                mixPanelOnLanguageChoose,
                mixPanelOnReferAFriend,
                mixPanelOnBookEndReading,
                mixPanelSignUp
            }}>
            {props.children}
        </AnalyticsContext.Provider>
    )
}

