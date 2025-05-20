import React, { useState } from 'react';
import { View, Button } from 'react-native';
import i18n from '@/app/i18n'; // dostosuj ścieżkę do i18n.ts
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
    const { t } = useTranslation();

    const [language, setLanguage] = useState<'en' | 'pl'>(i18n.language as 'en' | 'pl');

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'pl' : 'en';
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };

    return (
        <View>
            <Button
                onPress={toggleLanguage}
                title={language === 'en' ? t('lanToggle_PL') : t('lanToggle_EN')}
            />
        </View>
    );
};

export default LanguageToggle;
