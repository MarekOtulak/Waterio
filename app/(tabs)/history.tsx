import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHydration } from '@/context/HydrationContext'; // Kontekst zarządzający stanem nawodnienia (lokalnie i synchronizacja z Firestore)
import { ProgressBar } from 'react-native-paper'; // Prosty pasek postępu z biblioteki Paper
import { useTranslation } from 'react-i18next'; // Hook do tłumaczeń (i18n)

const goal = 2000; // Dzienny cel nawodnienia (w ml)

export default function History() {
    const { t } = useTranslation(); // Hook do tłumaczeń
    // Z kontekstu nawodnienia pobieramy:
    const { drinksToday, getTodayTotal, addDrinkEntry, removeDrinkEntry } = useHydration();
    // Lokalny stan dla wybranej ilości płynu do dodania
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    // Oblicz postęp względem celu nawodnienia (maksymalnie 100%)
    const progress = Math.min(getTodayTotal() / goal, 1);


    // Usunięcie wpisu po ID
    const handleRemoveDrink = (id: string) => {
        removeDrinkEntry(id); // Funkcja z HydrationContext – lokalnie usuwa i synchronizuje z Firestore
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            {/* Nagłówek z ikoną menu i polem wyszukiwania (na przyszłość) */}
            <View className="flex-row items-center justify-between mb-4">
                <Ionicons name="menu" size={28} color="black" />
                <TextInput
                    className="bg-white px-4 py-2 rounded-full flex-1 ml-4"
                    placeholder="Search" // TO DO: zastąpić przez `t('search')`
                />
            </View>
            {/* Pokazanie aktualnego nawodnienia vs. cel */}
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">{getTodayTotal()} ml / {goal} ml</Text>
            </View>
            {/* Pasek postępu nawodnienia */}
            <ProgressBar progress={progress} color="black" style={{ height: 10, borderRadius: 5, marginBottom: 16 }} />
            {/* Lista dzisiejszych wpisów nawodnienia */}
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
