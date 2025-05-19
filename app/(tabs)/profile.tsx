import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/services/authService';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t } = useTranslation();

    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            <Text className="text-2xl font-bold mb-6">{t('profile_title')}</Text>
            <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <Text className="text-lg mb-2 font-medium">{t('profile_email')}</Text>
                <Text className="text-gray-700 mb-4">{user?.email}</Text>
                <Text className="text-lg mb-2 font-medium">{t('profile_userId')}</Text>
                <Text className="text-gray-700 mb-1 text-xs">{user?.uid}</Text>
            </View>

            <TouchableOpacity
                className="bg-black py-3 px-6 rounded-full self-center flex-row items-center"
                onPress={handleLogout}
            >
                <Text className="text-white">{t('auth_logout')}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;
