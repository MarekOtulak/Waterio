import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };