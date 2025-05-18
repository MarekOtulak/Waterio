import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIKEY,
    AUTHDOMAIN,
    PROJECTID,
    STORAGEBUCKET,
    MESSAGINGSENDERID,
    APPID,
    MEASUREMENTID
} from '@env';

const firebaseConfig = {
    apiKey: "AIzaSyApNkg-USlUqzb_mdTgurV0y_EleNQhBWo",
    authDomain: "waterio-20733.firebaseapp.com",
    projectId: "waterio-20733",
    storageBucket: "waterio-20733.appspot.com",
    messagingSenderId: "1073728766619",
    appId: "1:1073728766619:web:4788448d01f28fac46fc3e",
    measurementId: "G-HEJTPQEMB7"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { db, auth };