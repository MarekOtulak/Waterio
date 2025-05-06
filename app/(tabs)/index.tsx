import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { ProgressBar } from 'react-native-paper';
import { useHydration } from '@/context/HydrationContext';
import dayjs from 'dayjs';  // Zaimportuj dayjs

const DAILY_GOAL_ML = 2000;

export default function Index() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const { addDrinkEntry, getTodayTotal } = useHydration();

    const totalDrank = getTodayTotal();
    const hydrationProgress = Math.min(totalDrank / DAILY_GOAL_ML, 1);

    const handleAddDrink = () => {
        if (selectedAmount !== null) {
            const newDrink = {
                volume: selectedAmount,
                type: 'water',
                time: dayjs().format('YYYY-MM-DD HH:mm:ss'), // Dodaj czas do drinka
            };
            addDrinkEntry(newDrink); // Przekazujemy pełny obiekt
            setSelectedAmount(null);
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            <Text className="text-xl font-bold mb-2">Today You Drank:</Text>

            {/* PROGRESS BAR */}
            <View className="mb-6">
                <ProgressBar progress={hydrationProgress} color="blue" style={{ height: 12, borderRadius: 6 }} />
                <Text className="text-sm mt-1">{Math.round(hydrationProgress * 100)}% of your daily goal</Text>
            </View>

            {/* PANEL DODAWANIA ILOŚCI */}
            <View className="flex-row flex-wrap justify-between gap-4 mb-6">
                {[330, 250, 180, 130].map((val, idx) => {
                    const isSelected = selectedAmount === val;
                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setSelectedAmount(val)}
                            className={`items-center p-2 rounded-xl ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
                        >
                            <Image source={icons.glasswater} style={{ width: 64, height: 128 }} />
                            <Text className="text-base font-semibold mt-1">{val} ml</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* BUTTON DODAWANIA */}
            <TouchableOpacity
                className={`py-3 px-6 rounded-full self-center flex-row items-center ${selectedAmount === null ? 'bg-gray-400' : 'bg-black'}`}
                disabled={selectedAmount === null}
                onPress={handleAddDrink}
            >
                <Ionicons name="add" size={24} color="white" />
                <Text className="text-white ml-2">Add a drink</Text>
            </TouchableOpacity>
        </View>
    );
}
