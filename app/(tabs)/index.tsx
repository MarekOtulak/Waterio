import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons'; // Ikony używane w aplikacji (np. szklanka wody)
import { useHydration } from '@/context/HydrationContext'; // Hook kontekstu nawadniania (lokalne + Firestore)
import { ProgressBar } from 'react-native-paper'; // Komponent progress-bara
import { useTranslation } from 'react-i18next'; // Hook do i18n (obsługa tłumaczeń)

// Predefiniowane objętości napojów do wyboru
const amounts = [330, 250, 180, 130];
const goal = 2000; // Codzienny cel nawodnienia (w ml)
// Obliczamy szerokość karty na podstawie rozmiaru ekranu
const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.4; // Responsive width for drink cards

export default function Index() {
    const { t } = useTranslation(); // Hook do pobierania przetłumaczonych tekstów

    const { addDrinkEntry, getTodayTotal } = useHydration(); // Funkcje z HydrationContext
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null); // Wybrana ilość wody
    // Obliczamy postęp nawodnienia jako procent celu
    const progress = Math.min(getTodayTotal() / goal, 1);
    // Obsługuje dodanie wpisu picia do lokalnego stanu i (później) synchronizacji z Firestore
    const handleAddDrink = () => {
        if (!selectedAmount) return;
        const now = new Date();

        // Dodaj wpis o wypitej wodzie z aktualnym czasem
        addDrinkEntry({
            time: now.toTimeString().slice(0, 5), // tylko godzina i minuta
            type: 'water', // tylko woda
            volume: selectedAmount,
        });
        setSelectedAmount(null); // Resetujemy wybór
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            {/* Tytuł ekranu: "Dziś wypiłeś" */}
            <Text className="text-xl font-bold mb-2">{t('home_todayDrank')}</Text>
            {/* Pasek z liczbą wypitych ml i celem */}
            <View className="flex-row items-center justify-between mb-4">
                <Text className="font-bold">{getTodayTotal()} ml / {goal} ml</Text>
            </View>
            {/* Graficzny pasek postępu nawodnienia */}
            <ProgressBar progress={progress} color="black" style={{ height: 10, borderRadius: 5, marginBottom: 20 }} />
            {/* Karty z opcjami ilości wody */}
            <View className="flex-row flex-wrap justify-between gap-4 mb-6">
                {amounts.map((val, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedAmount(val)}
                        style={{ width: cardWidth }} // Szerokość responsywna
                    >
                        <View
                            className={`items-center p-2 rounded-xl ${
                                selectedAmount === val ? 'bg-cyan-500/30 border-2 border-cyan-600' : '' // Podświetlenie aktywnego
                            }`}
                        >
                            <Image
                                source={icons.glasswater}
                                style={{
                                    width: 64,
                                    height: 128,
                                    opacity: selectedAmount === val ? 1 : 0.6, // Przezroczystość nieaktywna
                                }}
                            />
                            {/* Wyświetlana wartość (np. "330 ml") */}
                            <Text className="text-base font-semibold">{val} ml</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {/* Przycisk "Dodaj" z ikoną */}
            <TouchableOpacity
                className="bg-black py-3 px-6 rounded-full self-center flex-row items-center"
                onPress={handleAddDrink}
            >
                <Ionicons name="add" size={24} color="white" />
                <Text className="text-white ml-2">{t('home_addDrink')}</Text>
            </TouchableOpacity>
        </View>
    );
}
