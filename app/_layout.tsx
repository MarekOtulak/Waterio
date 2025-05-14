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
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen
                            name="login"
                            options={{
                                presentation: 'modal',
                            }}
                        />
                        <Stack.Screen
                            name="register"
                            options={{
                                presentation: 'modal',
                            }}
                        />
                    </Stack>
                </AuthGuard>
            </HydrationProvider>
        </AuthProvider>
    );
}