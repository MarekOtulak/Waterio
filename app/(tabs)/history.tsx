import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHydration } from '@/context/HydrationContext';
import { ProgressBar } from 'react-native-paper';

const goal = 2000;

export default function History() {
    const { drinksToday, getTodayTotal, addDrinkEntry, removeDrinkEntry } = useHydration();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const progress = Math.min(getTodayTotal() / goal, 1);

    const handleAddDrink = () => {
        if (!selectedAmount) return;
        const now = new Date();
        addDrinkEntry({
            time: now.toTimeString().slice(0, 5),
            type: 'water',
            volume: selectedAmount,
        });
        setSelectedAmount(null);
    };

    const handleRemoveDrink = (id: string) => {
        removeDrinkEntry(id);
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            <View className="flex-row items-center justify-between mb-4">
                <Ionicons name="menu" size={28} color="black" />
                <TextInput
                    className="bg-white px-4 py-2 rounded-full flex-1 ml-4"
                    placeholder="Search"
                />
            </View>

            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">{getTodayTotal()} ml / {goal} ml</Text>
            </View>

            <ProgressBar progress={progress} color="black" style={{ height: 10, borderRadius: 5, marginBottom: 16 }} />

            <ScrollView className="mb-4">
                {drinksToday.map((drink) => (
                    <View key={drink.id} className="flex-row items-center justify-between mb-2">
                        <Text className="text-base">● {drink.time} {drink.type}</Text>
                        <Text className="text-base font-semibold">{drink.volume} ml</Text>
                        <TouchableOpacity onPress={() => handleRemoveDrink(drink.id)}>
                            <Ionicons name="close" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
