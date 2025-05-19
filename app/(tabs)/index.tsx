import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { useHydration } from '@/context/HydrationContext';
import { ProgressBar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const amounts = [330, 250, 180, 130];
const goal = 2000;

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.4; // Responsive width for drink cards

export default function Index() {
    const { t } = useTranslation();

    const { addDrinkEntry, getTodayTotal } = useHydration();
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

    return (
        <View className="flex-1 bg-gradient-to-b from-cyan-100 to-cyan-300 px-4 pt-12">
            <Text className="text-xl font-bold mb-2">{t('home_todayDrank')}</Text>
            <View className="flex-row items-center justify-between mb-4">
                <Text className="font-bold">{getTodayTotal()} ml / {goal} ml</Text>
            </View>

            <ProgressBar progress={progress} color="black" style={{ height: 10, borderRadius: 5, marginBottom: 20 }} />

            <View className="flex-row flex-wrap justify-between gap-4 mb-6">
                {amounts.map((val, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedAmount(val)}
                        style={{ width: cardWidth }} // Apply responsive width here
                    >
                        <View
                            className={`items-center p-2 rounded-xl ${
                                selectedAmount === val ? 'bg-cyan-500/30 border-2 border-cyan-600' : ''
                            }`}
                        >
                            <Image
                                source={icons.glasswater}
                                style={{
                                    width: 64,
                                    height: 128,
                                    opacity: selectedAmount === val ? 1 : 0.6,
                                }}
                            />
                            <Text className="text-base font-semibold">{val} ml</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

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
