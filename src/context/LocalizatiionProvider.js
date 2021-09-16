import React, { createContext, useState, useEffect } from 'react';

import auth from '@react-native-firebase/auth';
import I18n from 'i18n-js';
import { memoize } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocalizatiionContext = createContext();

export const LocalizatiionProvider = (props) => {

    const user = auth().currentUser;
    const [currentLanguage, setLanguage] = useState('')

    const translationGetters = {
        en: () => require('../localize/en.json'),
        id: () => require('../localize/id.json'),
        vi: () => require('../localize/vi.json'),
        ms: () => require('../localize/ms.json'),
        fil: () => require('../localize/fil.json'),
        th: () => require('../localize/th.json')
    }

    const translate = memoize(
        (key, config) => I18n.t(key, config),
        (key, config) => (config ? key + JSON.stringify(config) : key)
    )

    const setI18nConfig = (language) => {
        I18n.translations = { [language]: translationGetters[language]() }
        I18n.locale = language
    }

    const getTranslation = (text) => {
        return translate(text)
    }
    
    const getLanguageName = (language) => {
        if (language == 'en') {
            return "english"
        }
        else if (language == 'id') {
            return "indonesian"
        }
        else if (language == 'vi') {
            return 'vietnamese'
        }
        else if (language == 'ms') {
            return "malaysian"
        }
        else if (language == 'fil') {
            return "tagalog-philippine"
        }
        else if (language == 'th') {
            return "thai"
        }
    }

    const getUserLanguage = (callback) => {
        AsyncStorage.getItem('user_current_selected_language', (error, result) => {
            let lan = result ? result : 'en'
            global.language = lan
            global.languageName = getLanguageName(lan)
            setLanguage(lan)
            callback(lan)
        })
    }
    
    const saveUserLanguage = (language) => {
        global.language = getLanguageName(language)
        AsyncStorage.setItem('user_current_selected_language', language)
    }

    return (
        <LocalizatiionContext.Provider
            value={{
                currentLanguage,
                setI18nConfig,
                getTranslation,
                getUserLanguage,
                saveUserLanguage
            }}>
            {props.children}
        </LocalizatiionContext.Provider>
    )
}
