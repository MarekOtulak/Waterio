import React, { useState } from 'react';
import { View, Button } from 'react-native';
import i18n from '@/app/i18n'; // Import konfiguracji i18n, gdzie definiowane są języki, tłumaczenia i ustawienia.
import { useTranslation } from 'react-i18next'; // Hook do używania tłumaczeń w komponentach funkcyjnych.

const LanguageToggle = () => {
    const { t } = useTranslation(); // Hook udostępniający funkcję `t()` do tłumaczeń tekstów.

    // Ustawienie początkowego języka na aktualnie używany język w i18n ('en' lub 'pl').
    const [language, setLanguage] = useState<'en' | 'pl'>(i18n.language as 'en' | 'pl');

    // Funkcja przełączająca język aplikacji.
    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'pl' : 'en'; // Jeśli aktualnie 'en', to przełącz na 'pl', i odwrotnie.
        i18n.changeLanguage(newLang); // Zmienia język w i18n (w całej aplikacji).
        setLanguage(newLang); // Lokalna aktualizacja stanu, by odświeżyć UI z odpowiednim językiem.
    };

    return (
        <View>
            <Button
                onPress={toggleLanguage} // Po kliknięciu zmień język.
                // Ustaw tytuł przycisku na przeciwny język – np. "Polski" jeśli aktualny to angielski.
                // Tekst jest pobierany z pliku tłumaczeń, np. lanToggle_PL: "Polski", lanToggle_EN: "English"
                title={language === 'en' ? t('lanToggle_PL') : t('lanToggle_EN')}
            />
        </View>
    );
};

export default LanguageToggle;
