import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
// Import hooka z kontekstu autoryzacji (dostarcza dane zalogowanego użytkownika)
import { useAuth } from '@/context/AuthContext';
// Import funkcji wylogowania z serwisu auth
import { logout } from '@/services/authService';
// Router z Expo – umożliwia przekierowania między ekranami
import { router } from 'expo-router';
// Hook do tłumaczeń (react-i18next)
import { useTranslation } from 'react-i18next';
// Komponent do przełączania języka (np. EN/PL)
import LanguageToggle from '@/components/LanguageToggle';

const Profile = () => {
    const { t } = useTranslation(); // Hook tłumaczeń

    // Pobieramy użytkownika z kontekstu (dostępne dane to np. email i uid)
    const { user } = useAuth();

    // Funkcja wylogowująca użytkownika
    const handleLogout = async () => {
        try {
            await logout(); // wykonujemy logout z Firebase
            router.replace('/(auth)/login'); // przekierowanie na ekran logowania
        } catch (error: any) {
            Alert.alert('Error', error.message); // Jeśli błąd – pokaż Alert z błędem
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            {/* Nagłówek ekranu – tytuł pobierany z tłumaczeń */}
            <Text className="text-2xl font-bold mb-6">{t('profile_title')}</Text>
            {/* Przełącznik języka (np. EN <-> PL) */}
            <LanguageToggle />
            {/* Karta z informacjami o użytkowniku */}
            <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <Text className="text-lg mb-2 font-medium">{t('profile_email')}</Text>
                <Text className="text-gray-700 mb-4">{user?.email}</Text>
                <Text className="text-lg mb-2 font-medium">{t('profile_userId')}</Text>
                <Text className="text-gray-700 mb-1 text-xs">{user?.uid}</Text>
            </View>
            {/* Przycisk wylogowania */}
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
