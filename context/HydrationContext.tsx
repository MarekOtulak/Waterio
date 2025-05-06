import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

type Drink = {
    time: string;
    type: string;
    volume: number;
};

type HydrationData = {
    [date: string]: Drink[];
};

type ContextType = {
    drinksToday: Drink[];
    addDrinkEntry: (drink: Drink) => void;  // Funkcja do dodawania napoju
    getTodayTotal: () => number;
    getTodayEntries: () => Drink[];
};

const HydrationContext = createContext<ContextType>({
    drinksToday: [],
    addDrinkEntry: () => {},  // Dodana funkcja addDrinkEntry
    getTodayTotal: () => 0,
    getTodayEntries: () => [],
});

export const useHydration = () => useContext(HydrationContext);

export const HydrationProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<HydrationData>({});
    const today = dayjs().format('YYYY-MM-DD');

    const addDrinkEntry = (drink: Drink) => {  // Implementacja addDrinkEntry
        setData(prev => {
            const updated = { ...prev };
            const todayList = updated[today] || [];
            updated[today] = [...todayList, drink];
            return updated;
        });
    };

    const getTodayTotal = () => {
        return (data[today] || []).reduce((total, drink) => total + drink.volume, 0);
    };

    const getTodayEntries = () => {
        return data[today] || [];
    };

    return (
        <HydrationContext.Provider value={{ drinksToday: data[today] || [], addDrinkEntry, getTodayTotal, getTodayEntries }}>
            {children}
        </HydrationContext.Provider>
    );
};
