import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // lokalne przechowywanie danych offline
import NetInfo from '@react-native-community/netinfo'; // wykrywanie połączenia sieciowego
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // operacje Firestore
import { db } from '@/firebaseConfig'; // konfiguracja Firestore
import { useAuth } from './AuthContext'; // aktualnie zalogowany użytkownik
import dayjs from 'dayjs'; // obsługa dat
// Struktura pojedynczego wpisu o nawodnieniu
type Drink = {
    id: string;
    time: string;
    type: string;
    volume: number;
    synced: boolean; // true = zsynchronizowany z Firestore
};
// Typ kontekstu, czyli co udostępniamy dzieciom
type ContextType = {
    drinksToday: Drink[]; // lista napojów z dzisiejszego dnia
    addDrinkEntry: (drink: Omit<Drink, 'id' | 'synced'>) => void; // dodanie nowego wpisu
    removeDrinkEntry: (id: string) => void; // usunięcie wpisu
    getTodayTotal: () => number; // suma objętości
    getTodayEntries: () => Drink[]; // wszystkie wpisy
};
//Kontekst i hook
const HydrationContext = createContext<ContextType | undefined>(undefined);

export const useHydration = () => {
    const context = useContext(HydrationContext);
    if (!context) throw new Error('useHydration must be used inside HydrationProvider');
    return context;
};

export const HydrationProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinksToday, setDrinksToday] = useState<Drink[]>([]); // aktualna lista napojów
    const { user } = useAuth(); // aktualny użytkownik
    const today = dayjs().format('YYYY-MM-DD'); // dzisiejsza data w formacie YYYY-MM-DD

    // Klucz lokalnego storage zależny od usera i daty
    const storageKey = user ? `hydration-${user.uid}-${today}` : `hydration-guest-${today}`;

    // Ref do zapamiętania poprzedniego usera (do czyszczenia danych)
    const prevUserRef = useRef<string | null>(null);

    // Efekt czyszczący dane przy zmianie usera
    useEffect(() => {
        const clearOldUserData = async () => {
            if (prevUserRef.current && prevUserRef.current !== user?.uid) {
                const oldStorageKey = `hydration-${prevUserRef.current}-${today}`;
                try {
                    await AsyncStorage.removeItem(oldStorageKey); // usunięcie starych danych
                } catch (e) {
                    console.error('Error clearing old user hydration data:', e);
                }
            }
            prevUserRef.current = user ? user.uid : null;

            // Zresetuj stan przy każdej zmianie usera lub wylogowaniu
            setDrinksToday([]);
        };

        clearOldUserData();
    }, [user, today]);

    // Efekt ładujący lokalne dane i Firestore po zmianie usera lub dnia
    useEffect(() => {
        const loadLocalData = async () => {
            try {
                const localData = await AsyncStorage.getItem(storageKey);
                if (localData) {
                    setDrinksToday(JSON.parse(localData)); // ładuj lokalne dane
                }

                if (user) {
                    const docRef = doc(db, 'users', user.uid, 'hydration', today);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data?.entries) {
                            const entries: Drink[] = data.entries.map((entry: any) => ({
                                ...entry,
                                synced: true, // oznacz jako zsynchronizowane
                            }));

                            setDrinksToday(entries);
                            await AsyncStorage.setItem(storageKey, JSON.stringify(entries));
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading hydration data:', error);
            }
        };

        loadLocalData();
    }, [user, today, storageKey]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                syncUnsyncedEntries(); // wyślij dane do Firestore
            }
        });

        return () => {
            unsubscribe();
        };
    }, [drinksToday, user]);
    // Zapis do AsyncStorage
    const saveToLocal = async (entries: Drink[]) => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving hydration data locally:', error);
        }
    };

    //Synchronizacja danych offline → Firestore
    const syncUnsyncedEntries = async () => {
        if (!user) return;
        const unsynced = drinksToday.filter(drink => !drink.synced); // wybierz niezsynchronizowane
        if (unsynced.length === 0) return;

        const docRef = doc(db, 'users', user.uid, 'hydration', today);

        try {
            const docSnap = await getDoc(docRef);
            const existingEntries = docSnap.exists() ? docSnap.data().entries || [] : [];

            const newEntries = [...existingEntries, ...unsynced.map(({ synced, ...rest }) => rest)];

            await setDoc(docRef, {
                entries: newEntries,
                date: today,
                lastUpdated: new Date().toISOString(),
            });
            // oznacz jako zsynchronizowane
            const updatedDrinks = drinksToday.map(drink =>
                unsynced.find(u => u.id === drink.id) ? { ...drink, synced: true } : drink
            );
            setDrinksToday(updatedDrinks);
            await saveToLocal(updatedDrinks);
        } catch (error) {
            console.error('Error syncing hydration data:', error);
        }
    };

    const addDrinkEntry = async (drink: Omit<Drink, 'id' | 'synced'>) => {
        const newDrink: Drink = {
            id: Date.now().toString(), // unikalne ID na podstawie czasu
            ...drink,
            synced: false,
        };
        const updatedDrinks = [...drinksToday, newDrink];
        setDrinksToday(updatedDrinks);
        await saveToLocal(updatedDrinks);
        // Spróbuj zsynchronizować jeśli online
        const netState = await NetInfo.fetch();
        if (netState.isConnected) {
            syncUnsyncedEntries();
        }
    };

    //Usuwanie wpisu
    const removeDrinkEntry = async (id: string) => {
        const updatedDrinks = drinksToday.filter(drink => drink.id !== id);
        setDrinksToday(updatedDrinks);
        await saveToLocal(updatedDrinks);

        const netState = await NetInfo.fetch();
        if (netState.isConnected && user) {
            const docRef = doc(db, 'users', user.uid, 'hydration', today);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const existingEntries = docSnap.data().entries || [];
                    const newEntries = existingEntries.filter((entry: any) => entry.id !== id);
                    await updateDoc(docRef, {
                        entries: newEntries,
                        lastUpdated: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error('Error removing hydration entry from Firestore:', error);
            }
        }
    };
    //Sumy i dostęp do danych
    const getTodayTotal = () => drinksToday.reduce((sum, d) => sum + d.volume, 0);
    const getTodayEntries = () => drinksToday;
    //Eksport kontekstu
    return (
        <HydrationContext.Provider
            value={{ drinksToday, addDrinkEntry, removeDrinkEntry, getTodayTotal, getTodayEntries }}
        >
            {children}
        </HydrationContext.Provider>
    );
};
