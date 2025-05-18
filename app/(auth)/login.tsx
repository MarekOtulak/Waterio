import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { loginWithEmail, resetPassword } from '@/services/authService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email and password are required');
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
            Alert.alert('Email Required', 'Please enter your email address to reset your password');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email);
            Alert.alert('Password Reset', 'Check your email for password reset instructions');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('/(auth)/register');
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-6 justify-center">
            <Text className="text-3xl font-bold mb-8 text-center">Waterio</Text>
            <Text className="text-2xl font-semibold mb-6 text-center">Login</Text>

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
                    <Text className="text-white text-center font-semibold text-lg">Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                <Text className="text-center text-gray-700 mb-6">Forgot Password?</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
                <Text className="text-gray-700">Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                    <Text className="font-semibold">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
