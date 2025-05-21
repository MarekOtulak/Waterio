import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router'; // do nawigacji między ekranami
import { loginWithEmail, resetPassword } from '@/services/authService'; // serwis logowania i resetowania hasła (Firebase Auth)
import { useTranslation } from 'react-i18next'; // i18n – tłumaczenia

export default function Login() {
    const { t } = useTranslation(); // funkcja tłumaczeń z react-i18next

    // Stany do przechowywania danych formularza i statusu ładowania
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Logika logowania użytkownika
    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('login_missingFields')); // komunikat z tłumaczeń jeśli brakuje danych
            return;
        }

        setError('');
        setIsLoading(true); // start spinnera

        try {
            await loginWithEmail(email, password); // funkcja z authService – logowanie przez Firebase
            router.replace('/(tabs)'); // przekierowanie do głównych zakładek po zalogowaniu
        } catch (error: any) {
            setError(error.message); // wyświetlenie błędu jeśli logowanie się nie uda
        } finally {
            setIsLoading(false); // koniec spinnera
        }
    };
    // Obsługa zapomnianego hasła (wysyłka e-maila resetującego)
    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert(t('login_resetError'), t('auth_emailMissing')); // wymagany e-mail
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email); // wysyła e-mail resetujący hasło przez Firebase
            Alert.alert(t('auth_resetPassword'), t('auth_resetSuccess')); // komunikat sukcesu
        } catch (error: any) {
            Alert.alert(t('auth_error'), error.message); // komunikat błędu
        } finally {
            setIsLoading(false);
        }
    };
    // Przejście do ekranu rejestracji
    const navigateToRegister = () => {
        router.replace('/(auth)/register');
    };
    // UI ekranu logowania
    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-6 justify-center">
            {/* Nazwa aplikacji i nagłówek */}
            <Text className="text-3xl font-bold mb-8 text-center">{t('app_name')}</Text>
            <Text className="text-2xl font-semibold mb-6 text-center">{t('login_title')}</Text>
            {/* Wyświetlenie błędu (np. brak danych lub błąd logowania) */}
            {error ? <Text className="text-red-600 mb-4 text-center">{error}</Text> : null}
            {/* Pole e-mail */}
            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            {/* Pole hasła */}
            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-6"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {/* Przycisk logowania */}
            <TouchableOpacity
                className="bg-black py-3 px-6 rounded-xl mb-4"
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" /> // spinner podczas logowania
                ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                        {t('login_submit')} {/* przycisk: Zaloguj */}
                    </Text>
                )}
            </TouchableOpacity>
            {/* Link do resetowania hasła */}
            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                <Text className="text-center text-gray-700 mb-6">{t('login_forgot')}</Text>
            </TouchableOpacity>
            {/* Link do rejestracji, jeśli użytkownik nie ma konta */}
            <View className="flex-row justify-center">
                <Text className="text-gray-700">{t('login_registerQuestion')}</Text>
                <TouchableOpacity onPress={navigateToRegister}>
                    <Text className="font-semibold">{t('login_registerLink')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
