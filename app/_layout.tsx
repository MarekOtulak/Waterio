// Importuje system nawigacji stosu z `expo-router` (czyli coś jak "ekrany jeden na drugim")
import { Stack } from 'expo-router';
// Importuje globalny CSS — zdefiniowane klasy tailwindowe, resetowanie styli itp.
import './global.css';
// Kontekst zarządzający danymi nawodnienia (dzienne wpisy, synchronizacja offline/online)
import { HydrationProvider } from '@/context/HydrationContext';
// Kontekst autoryzacji — trzyma stan użytkownika (zalogowany/niezalogowany), dane użytkownika itd.
import { AuthProvider } from '@/context/AuthContext';
// Komponent zabezpieczający – tylko zalogowani użytkownicy mają dostęp do ekranu (tabs itp.)
import AuthGuard from '@/components/AuthGuard';
// Provider i18n — dostarcza funkcje tłumaczeń `t()` do całej aplikacji
import { I18nextProvider } from 'react-i18next';
// Konfiguracja i instancja tłumaczeń i18n
import i18n, {initI18n} from './i18n';
// Reactowe hooki — do inicjalizacji (useEffect) i stanu lokalnego (useState)
import { useEffect, useState } from 'react';

export default function RootLayout() {
    const [ready, setReady] = useState(false); // stan ładowania tłumaczeń (czy gotowe do działania)

    useEffect(() => {
        const init = async () => {
            await initI18n(); // inicjalizacja tłumaczeń (np. ładowanie języka, namespace itp.)
            setReady(true); // dopiero wtedy można bezpiecznie wyświetlić resztę UI
        };
        init(); // odpal funkcję
    }, []);

    if (!ready) return null; // unikamy renderowania aplikacji bez dostępnych tłumaczeń

    // I18nextProvider: dostarcza dostęp do tłumaczeń przez `t()`
    // AuthProvider: dostarcza dostęp do danych logowania użytkownika
    // HydrationProvider: trzyma lokalne wpisy nawodnienia, synchronizuje z Firestore
    // AuthGuard: sprawdza, czy użytkownik jest zalogowany; jeśli nie, przekierowuje do logowania
    // <Stack screenOptions={{ headerShown: false }}>: konfiguracja stosu ekranów (np. tabsy)
    // <Stack.Screen name="(tabs)" /> główny layout tabów (BottomTabs)
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <HydrationProvider>
                    <AuthGuard>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </AuthGuard>
                </HydrationProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}