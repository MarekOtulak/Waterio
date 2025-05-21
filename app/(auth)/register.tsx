import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router'; // umożliwia nawigację między ekranami w Expo Router
import { registerWithEmail } from '@/services/authService'; // niestandardowa funkcja rejestracji użytkownika przez Firebase Auth
import { useTranslation } from 'react-i18next'; // hook do internacjonalizacji z react-i18next

export default function Register() {
    const { t } = useTranslation(); // dostęp do tłumaczeń

    // Lokalne stany formularza i statusów
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // spinner ładowania
    const [error, setError] = useState(''); // komunikat błędu

    // Główna funkcja obsługująca proces rejestracji
    const handleRegister = async () => {

        // Walidacja pól formularza
        if (!email || !password || !confirmPassword) {
            setError(t('register_AllReq'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth_passwordsNoMatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('auth_passwordTooShort'));
            return;
        }

        // Reset błędu i włączenie spinnera
        setError('');
        setIsLoading(true);

        try {
            // Próba rejestracji użytkownika przez Firebase Auth
            await registerWithEmail(email, password);
            // Po sukcesie – przekierowanie do głównych zakładek aplikacji
            router.replace('/(tabs)');
        } catch (error: any) {
            // Obsługa błędów Firebase (np. email already in use, invalid email)
            setError(error.message);
        } finally {
            setIsLoading(false); // spinner off
        }
    };

    // Przekierowanie do ekranu logowania
    const navigateToLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-6 justify-center">
            {/* Nazwa aplikacji */}
            <Text className="text-3xl font-bold mb-8 text-center">{t('app_name')}</Text>
            {/* Nagłówek formularza rejestracji */}
            <Text className="text-2xl font-semibold mb-6 text-center">{t('register_create')}</Text>
            {/* Komunikat o błędzie */}
            {error ? <Text className="text-red-600 mb-4 text-center">{error}</Text> : null}
            {/* Pole email */}
            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder={t('auth_email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            {/* Pole hasła */}
            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder={t('auth_password')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {/* Potwierdzenie hasła */}
            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-6"
                placeholder={t('auth_confirmPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {/* Przycisk rejestracji – z spinnerem podczas ładowania */}
            <TouchableOpacity
                className="bg-black py-3 px-6 rounded-xl mb-6"
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-semibold text-lg">{t('auth_register')}</Text>
                )}
            </TouchableOpacity>
            {/* Link do logowania */}
            <View className="flex-row justify-center">
                <Text className="text-gray-700">{t('auth_haveAccount')}</Text>
                <TouchableOpacity onPress={navigateToLogin}>
                    <Text className="font-semibold">{t('auth_signIn')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
