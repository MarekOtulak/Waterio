import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth, db } from '@/firebaseConfig'; // konfiguracja Firebase: auth (uwierzytelnianie) i db (Firestore)
import { doc, setDoc, getDoc } from 'firebase/firestore';

//Rejestracja nowego użytkownika przy użyciu e-maila i hasła.
//Tworzy również dokument użytkownika w kolekcji `users` w Firestore.
export const registerWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        // Tworzy nowego użytkownika w Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Tworzy dokument użytkownika w Firestore (na przyszłość — dane profilu)
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, {
            email: email,
            createdAt: new Date().toISOString(), // timestamp utworzenia konta
        });

        return userCredential.user;
    } catch (error: any) {
        // Obsługa najczęstszych błędów rejestracji
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email is already registered. Please use a different email or login.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('The email address is not valid.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password is too weak. Please use at least 6 characters.');
        }
        throw new Error(error.message || 'Registration failed');
    }
};

//Logowanie użytkownika na podstawie e-maila i hasła.
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        // Próba logowania za pomocą Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        // Obsługa błędów logowania — np. niepoprawne dane lub zablokowane konto
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password. Please try again.');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many failed login attempts. Please try again later.');
        } else if (error.code === 'auth/user-disabled') {
            throw new Error('This account has been disabled.');
        }
        throw new Error(error.message || 'Login failed');
    }
};

//Wylogowanie aktualnie zalogowanego użytkownika.
//Po stronie aplikacji warto tu też wyczyścić lokalny kontekst użytkownika.
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Logout failed');
    }
};

//Wysłanie e-maila resetującego hasło.
//Użytkownik musi podać poprawny adres e-mail zarejestrowany w Firebase.
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('No account found with this email address.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('The email address is not valid.');
        }
        throw new Error(error.message || 'Password reset failed');
    }
};

//Zwraca aktualnie zalogowanego użytkownika (lub null, jeśli nikt nie jest zalogowany).
//Używane w `AuthContext`, np. do sprawdzenia, czy użytkownik ma dostęp do guarded routes.
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

//Subskrypcja zmian stanu autoryzacji.
//Wykorzystywane w kontekście AuthContext do reagowania na logowanie/wylogowanie.
//`callback` otrzyma obiekt użytkownika lub `null`.
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};