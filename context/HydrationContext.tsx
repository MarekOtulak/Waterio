import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { db } from '@/firebaseConfig';
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type Drink = {
    id: string; // Dodane pole ID
    time: string;
    type: string;
    volume: number;
};

type ContextType = {
    drinksToday: Drink[];
    addDrinkEntry: (drink: Omit<Drink, 'id'>) => void;
    removeDrinkEntry: (id: string) => void;
    getTodayTotal: () => number;
    getTodayEntries: () => Drink[];
};

const HydrationContext = createContext<ContextType | undefined>(undefined);

export const useHydration = () => {
    const context = useContext(HydrationContext);
    if (!context) throw new Error('useHydration must be used inside HydrationProvider');
    return context;
};

export const HydrationProvider = ({ children }: { children: React.ReactNode }) => {
    const [drinksToday, setDrinksToday] = useState<Drink[]>([]);
    const { user } = useAuth();
    const today = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        if (!user) {
            setDrinksToday([]);
            return () => {};
        }

        const docRef = doc(db, 'users', user.uid, 'hydration', today);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const data = snapshot.data();
            if (data?.entries) {
                setDrinksToday(data.entries);
            } else {
                setDrinksToday([]);
            }
        }, (error) => {
            console.error("Error fetching hydration data:", error);
            setDrinksToday([]);
        });

        return () => unsubscribe();
    }, [user, today]);

    const addDrinkEntry = async (drink: Omit<Drink, 'id'>) => {
        if (!user) return;

        const newEntry: Drink = {
            id: Date.now().toString(),
            ...drink,
        };

        const docRef = doc(db, 'users', user.uid, 'hydration', today);

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    entries: [...drinksToday, newEntry],
                    lastUpdated: new Date().toISOString(),
                });
            } else {
                await setDoc(docRef, {
                    entries: [newEntry],
                    date: today,
                    lastUpdated: new Date().toISOString(),
                });
            }
        } catch (error) {
            console.error('Error adding hydration entry:', error);
        }
    };

    const removeDrinkEntry = async (id: string) => {
        if (!user) return;

        const updatedEntries = drinksToday.filter(drink => drink.id !== id);

        const docRef = doc(db, 'users', user.uid, 'hydration', today);

        try {
            await updateDoc(docRef, {
                entries: updatedEntries,
                lastUpdated: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error removing hydration entry:', error);
        }
    };

    const getTodayTotal = () => drinksToday.reduce((sum, d) => sum + d.volume, 0);
    const getTodayEntries = () => drinksToday;

    return (
        <HydrationContext.Provider
            value={{ drinksToday, addDrinkEntry, removeDrinkEntry, getTodayTotal, getTodayEntries }}
        >
            {children}
        </HydrationContext.Provider>
    );
};
