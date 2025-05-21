import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext'; // kontekst autoryzacji: dostęp do aktualnego użytkownika i stanu ładowania
import { useSegments, useRouter } from 'expo-router'; // hooki z expo-routera do analizy ścieżki i nawigacji

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth(); // pobieramy aktualnego użytkownika i informację, czy auth jest jeszcze ładowane
    const segments = useSegments(); // zwraca tablicę segmentów ścieżki, np. ['(tabs)', 'profile']
    const router = useRouter(); // narzędzie do nawigacji między ekranami

    useEffect(() => {
        // jeśli dane użytkownika nadal się ładują — nie podejmujemy żadnych akcji
        if (isLoading) return;
        // sprawdzamy, czy aktualna ścieżka zaczyna się od '(tabs)' — czyli czy user próbuje wejść na ekran dostępny tylko po zalogowaniu
        const inAuthGroup = segments[0] === '(tabs)';
        // jeśli nie ma użytkownika (czyli niezalogowany), ale próbuje wejść na ekran z '(tabs)', to przekieruj go na login
        if (!user && inAuthGroup) {
            router.replace('/(auth)/login'); // replace zamiast push, żeby nie można było wrócić gestem
        }
        // jeśli jest użytkownik (czyli zalogowany), ale nie jest na trasie z '(tabs)', to przekieruj go na główną zakładkę
        else if (user && !inAuthGroup) {
            router.replace('../(tabs)/index');
        }
    }, [user, isLoading]);
    // jeśli dane o użytkowniku nadal się ładują — pokaż spinner ładowania
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }
    // jeśli wszystko OK — renderuj dzieci (czyli komponenty wewnątrz chronionej ścieżki)
    return <>{children}</>;
};

export default AuthGuard;
