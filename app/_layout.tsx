import { Stack } from 'expo-router';
import './global.css';
import { HydrationProvider } from '@/context/HydrationContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { I18nextProvider } from 'react-i18next';
import i18n, {initI18n} from './i18n';
import { useEffect, useState } from 'react';

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            await initI18n();
            setReady(true);
        };
        init();
    }, []);

    if (!ready) return null; // albo spinner

    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <HydrationProvider>
                    <AuthGuard>
                        <Stack screenOptions={{ headerShown: true }}>
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </AuthGuard>
                </HydrationProvider>
            </AuthProvider>
        </I18nextProvider>
    ); //zmienić później headershown na false
}