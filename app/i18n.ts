// Import głównej instancji i18next – biblioteki do zarządzania tłumaczeniami
import i18n from 'i18next';
// Adapter do integracji i18next z Reactem (np. umożliwia używanie hooka `useTranslation`)
import { initReactI18next } from 'react-i18next';
// Import zasobów tłumaczeń z jednego pliku – tu masz wszystkie teksty aplikacji (PL, EN, itp.)
import { resources } from "@/languages/translation";

// Asynchroniczna funkcja inicjalizująca konfigurację i18next – odpalana przy starcie aplikacji (np. w layout lub root app)
export const initI18n = async () => {
    // Konfiguracja instancji i18n:
    await i18n
        .use(initReactI18next) // używamy adaptera reactowego
        .init({
            resources,   // Moje tłumaczenia (np. { pl: { translation: { ... } }, en: {...} })
            lng: 'pl',  // Domyślny język (na start)
            fallbackLng: 'pl', // Język awaryjny, jeśli nie znajdzie tłumaczenia
            interpolation: {
                escapeValue: false // Nie escapujemy wartości, bo React robi to automatycznie (zapobiega podwójnemu escapowaniu)
            }
        });
};
// Eksport instancji i18n do użycia np. wymuszeniu zmiany języka
export default i18n;