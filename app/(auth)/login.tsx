import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { loginWithEmail, resetPassword } from '@/services/authService';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('login_missingFields'));
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await loginWithEmail(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert(t('login_resetError'), t('auth_emailMissing'));
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email);
            Alert.alert(t('auth_resetPassword'), t('auth_resetSuccess'));
        } catch (error: any) {
            Alert.alert(t('auth_error'), error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.replace('/(auth)/register');
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-6 justify-center">
            <Text className="text-3xl font-bold mb-8 text-center">{t('app_name')}</Text>
            <Text className="text-2xl font-semibold mb-6 text-center">{t('login_title')}</Text>

            {error ? <Text className="text-red-600 mb-4 text-center">{error}</Text> : null}

            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-6"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                className="bg-black py-3 px-6 rounded-xl mb-4"
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-semibold text-lg">{t('login_submit')}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                <Text className="text-center text-gray-700 mb-6">{t('login_forgot')}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
                <Text className="text-gray-700">{t('login_registerQuestion')}</Text>
                <TouchableOpacity onPress={navigateToRegister}>
                    <Text className="font-semibold">{t('login_registerLink')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
