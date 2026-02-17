'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    weddingId: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    weddingId: null,
    login: async () => { },
    signup: async () => { },
    loginWithGoogle: async () => { },
    logout: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [weddingId, setWeddingId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Ensure a wedding workspace exists for this user
                const weddingDocRef = doc(db, 'weddings', user.uid);
                const weddingDoc = await getDoc(weddingDocRef);

                if (!weddingDoc.exists()) {
                    // Initialize a new workspace for new users
                    await setDoc(weddingDocRef, {
                        plannerId: user.uid,
                        weddingName: `${user.displayName || 'My'} Wedding`,
                        date: null,
                        venue: 'TBD',
                        budget: 1000000, // Default 10L budget
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    });
                }

                setWeddingId(user.uid);
            } else {
                setWeddingId(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    async function login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    async function signup(email: string, password: string) {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

    const value = { user, loading, weddingId, login, signup, loginWithGoogle, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
