import React, { createContext, useState, useEffect } from 'react';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

export const APPContext = createContext();

export const APPProvider = (props) => {

    const user = auth().currentUser;

    const [userSubscriptionDetails, setUserSubscriptionDetails] = useState(null);
    const [isSubscribe, setSubscribe] = useState(false);
    const [RemainingDays, setReamainingDays] = useState(0);

    useEffect(() => {
        checkSubscribtion()
    }, [userSubscriptionDetails])

    const getSubscriptionDetails = async (callback) => {
        firestore()
            .collection('subscriber')
            .doc(user.email)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    let item = documentSnapshot.data()
                    setUserSubscriptionDetails(item)
                    callback(true)
                }
                else {
                    setSubscribe(false)
                    callback(true)
                }
            }).catch((e) => {
                setSubscribe(false)
                callback(true)
            })
    }

    async function checkSubscribtion() {
        if (userSubscriptionDetails) {
            let expiry = userSubscriptionDetails.expiryDate
            let date = moment(expiry, 'YYYY-MM-DD')
            let today = moment()
            if (date.isAfter(today)) {
                let days = date.diff(today, 'days')
                if (days < 0) {
                    updatePaid(false)
                    setSubscribe(false)
                }
                else if (days == 0) {
                    updatePaid(true)
                    setSubscribe(true)
                    setReamainingDays('1')
                }
                else {
                    updatePaid(true)
                    setSubscribe(true)
                    setReamainingDays(days)
                }
            }
            else {
                updatePaid(false)
                setSubscribe(false)
            }
        }
    }

    updatePaid = (isPaid) => {
        firestore()
            .collection('users')
            .doc(user.email)
            .update({
                isPaid: isPaid,
                language: global.language
            })
            .then(() => {
                
            }).catch((error) => {
                console.log(error)
            })
        }

    return (
        <APPContext.Provider
            value={{
                userSubscriptionDetails,
                setUserSubscriptionDetails,
                isSubscribe,
                setSubscribe,
                getSubscriptionDetails,
                RemainingDays
            }}>
            {props.children}
        </APPContext.Provider>
    )
}
