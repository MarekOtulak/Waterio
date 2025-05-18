import { Stack } from 'expo-router';
import './global.css';
import { HydrationProvider } from '@/context/HydrationContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function RootLayout() {
    return (
        <AuthProvider>
            <HydrationProvider>
                <AuthGuard>
                    <Stack screenOptions={{ headerShown: true }}>
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                </AuthGuard>
            </HydrationProvider>
        </AuthProvider>
    ); //zmienić później headershown na false
}