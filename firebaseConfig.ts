// Inicjalizacja Firebase Core SDK
import { initializeApp } from 'firebase/app';
// Inicjalizacja Firebase Auth z pamięcią dostosowaną do React Native (AsyncStorage)
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// AsyncStorage używane do trwałego przechowywania sesji użytkownika w aplikacji mobilnej
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Firestore jako baza danych w chmurze do przechowywania danych nawodnienia
import { getFirestore } from 'firebase/firestore';
// Zmienne środowiskowe – do naprawy: można ich używać zamiast danych wpisanych na sztywno (.env zalecane)
import {
    APIKEY,
    AUTHDOMAIN,
    PROJECTID,
    STORAGEBUCKET,
    MESSAGINGSENDERID,
    APPID,
    MEASUREMENTID
} from '@env';

// Konfiguracja Firebase – aktualnie wpisana na sztywno
const firebaseConfig = {
    apiKey: "AIzaSyApNkg-USlUqzb_mdTgurV0y_EleNQhBWo", // Klucz API do komunikacji z Firebase
    authDomain: "waterio-20733.firebaseapp.com", // Domeny dla autoryzacji (np. email/password)
    projectId: "waterio-20733", // ID projektu Firebase
    storageBucket: "waterio-20733.appspot.com",
    messagingSenderId: "1073728766619",
    appId: "1:1073728766619:web:4788448d01f28fac46fc3e", // Unikalne ID aplikacji Firebase
    measurementId: "G-HEJTPQEMB7" // (opcjonalne) – do Google Analytics
};

// Inicjalizacja aplikacji Firebase – singleton używany w całej aplikacji
const app = initializeApp(firebaseConfig);

// Inicjalizacja Firebase Auth z obsługą trwałej sesji dzięki AsyncStorage (wymagane dla React Native)
// Dzięki temu użytkownik nie musi się ponownie logować po restarcie aplikacji
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicjalizacja Firestore – używany do zapisywania danych o nawodnieniu (wpisy dzienne)
// W moim przypadku działa jako *backup* danych lokalnych (offline-first model)
const db = getFirestore(app);

// Eksport gotowych instancji bazy danych i autoryzacji – używane w `authService`, `HydrationContext` itp.
export { db, auth };