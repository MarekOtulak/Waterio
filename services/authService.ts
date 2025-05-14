import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Register a new user with email and password
export const registerWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore
        const userDoc = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDoc, {
            email: email,
            createdAt: new Date().toISOString(),
        });

        return userCredential.user;
    } catch (error: any) {
        // Handle specific Firebase errors with more user-friendly messages
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

// Login with email and password
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        // Handle specific Firebase errors with more user-friendly messages
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

// Sign out the current user
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message || 'Logout failed');
    }
};

// Send password reset email
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

// Get current authenticated user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};