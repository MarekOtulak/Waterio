import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useHydration } from '@/context/HydrationContext';

const DAILY_GOAL_ML = 2000;

export default function History() {
    const { getTodayEntries, getTodayTotal } = useHydration();

    const drinksToday = getTodayEntries();
    const totalDrank = getTodayTotal();
    const hydrationProgress = Math.min(totalDrank / DAILY_GOAL_ML, 1);

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            {/* Progress bar */}
            <View className="mb-4">
                <ProgressBar progress={hydrationProgress} color="blue" style={{ height: 12, borderRadius: 6 }} />
                <Text className="text-sm mt-1 text-right">{totalDrank} ml / {DAILY_GOAL_ML} ml</Text>
            </View>

            {/* Historia wpisów */}
            <ScrollView className="mb-4">
                {drinksToday.length === 0 ? (
                    <Text className="text-center text-gray-600 mt-8">Brak zarejestrowanych wpisów</Text>
                ) : (
                    drinksToday.map((drink, idx) => (
                        <View
                            key={idx}
                            className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-2"
                        >
                            <View>
                                <Text className="text-base font-bold">{drink.volume} ml</Text>
                                <Text className="text-sm text-gray-500">{drink.time} · {drink.type}</Text>
                            </View>
                            <Ionicons name="close" size={20} color="black" />
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Przycisk dodawania */}
            <TouchableOpacity className="py-3 px-6 bg-white rounded-full self-center">
                <Text className="text-black font-semibold">Add a drink</Text>
            </TouchableOpacity>

            <Text className="text-center mt-4 text-sm text-black">Contact Us</Text>
        </View>
    );
}
