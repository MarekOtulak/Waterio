import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { registerWithEmail } from '@/services/authService';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
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

        setError('');
        setIsLoading(true);

        try {
            await registerWithEmail(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-6 justify-center">
            <Text className="text-3xl font-bold mb-8 text-center">{t('app_name')}</Text>
            <Text className="text-2xl font-semibold mb-6 text-center">{t('register_create')}</Text>

            {error ? <Text className="text-red-600 mb-4 text-center">{error}</Text> : null}

            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder={t('auth_email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-4"
                placeholder={t('auth_password')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                className="bg-white px-4 py-3 rounded-xl mb-6"
                placeholder={t('auth_confirmPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

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

            <View className="flex-row justify-center">
                <Text className="text-gray-700">{t('auth_haveAccount')}</Text>
                <TouchableOpacity onPress={navigateToLogin}>
                    <Text className="font-semibold">{t('auth_signIn')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
