import { Stack } from "expo-router";
import { HydrationProvider } from "@/context/HydrationContext"; // dodajesz import
import "./global.css";

export default function RootLayout() {
    return (
        <HydrationProvider> {/* <-- tu otaczasz całą aplikację */}
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </HydrationProvider>
    );
}
