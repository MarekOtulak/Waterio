// Importy potrzebnych hooków i typów z Reacta oraz Firebase
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
// Import funkcji z serwisu, która subskrybuje zmiany stanu logowania użytkownika
import { subscribeToAuthChanges } from '@/services/authService';

// Typ kontekstu - zawiera aktualnie zalogowanego użytkownika oraz stan ładowania
type AuthContextType = {
    user: User | null; // Dane użytkownika z Firebase (lub null, jeśli nie zalogowany)
    isLoading: boolean; // Czy trwa ładowanie informacji o użytkowniku
};

// Tworzenie kontekstu autoryzacji
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook umożliwiający dostęp do kontekstu w komponentach
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};

// Główny provider kontekstu, który będzie opakowywał całą aplikację
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Hook uruchamiany raz przy montowaniu komponentu
    useEffect(() => {
        // Subskrypcja zmian logowania Firebase – np. logowanie, wylogowanie, odświeżenie sesji
        const unsubscribe = subscribeToAuthChanges((user) => {
            setUser(user); // Aktualizacja stanu użytkownika
            setIsLoading(false); // Zakończenie ładowania
        });
        // Czyszczenie subskrypcji przy odmontowaniu komponentu
        return () => unsubscribe();
    }, []);
    // Udostępnienie stanu użytkownika i ładowania dzieciom (całej aplikacji)
    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};