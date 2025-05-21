import React from 'react';
import {Tabs} from "expo-router"; // Nawigacja dolna w stylu "tabów"
import {images} from "@/constants/images"; // Import zdefiniowanych obrazów (np. tło dla aktywnego taba)
import {Image, ImageBackground, Text, View} from "react-native";
import {icons} from "@/constants/icons"; // Ikony (home, search, person)
import { useTranslation } from 'react-i18next'; // i18n hook do tłumaczeń

// Komponent wyświetlający ikonę i tytuł tab-a, z wyróżnieniem jeśli aktywny
const TabIcon = ({ focused, icon, title }: any) => {
    if(focused) {
        // Jeśli zakładka aktywna, to pokazuje tło (highlight) i tekst
        return(
            <ImageBackground
                source={images.highlight} // np. gradient lub inny dekoracyjny obrazek
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
            </ImageBackground>
        )
    }
    // Dla nieaktywnych tylko ikona (wyblakła)
    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
            <Image source={icon} tintColor="#A8B5DB" className="size-5" />
        </View>
    )
}

// Layout zakładek – używany jako kontener dla ekranów: index, history, profile
const TabsLayout = () => {
    const { t } = useTranslation(); // Hook i18n do dynamicznych tłumaczeń
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false, // Ukryj domyślne napisy pod ikonami
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                },
                tabBarStyle: {
                    backgroundColor: "#0f0D23", // Ciemne tło pasujące do designu Waterio
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "0f0d23"
                }
            }}
        >
            {/* Strona główna – z wykresem i przyciskiem dodawania wody */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false, // Ukryj górny pasek
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title={t('tabs_home')} // "Strona główna" – tłumaczone
                        />
                    )
                }}
            />
            {/* Historia nawodnień – lista zapisanych wpisów */}
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.search}
                            title={t('tabs_history')}
                        />
                    )
                }}
            />
            {/* Profil użytkownika – zarządzanie kontem, językiem itd. */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.person}
                            title={t('profile_title')}
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout
