import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resources } from "@/languages/en";
import { resourcesPL } from "@/languages/pl";


export const initI18n = async () => {

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: 'pl',
            fallbackLng: 'pl',
            interpolation: {
                escapeValue: false
            }
        });
};

export default i18n;