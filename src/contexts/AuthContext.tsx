"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;
    
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setLoading(false);
        return;
      }

      unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (mounted) {
            setUser(firebaseUser);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Auth state error:", error);
          if (mounted) {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Firebase auth initialization error:", error);
      if (mounted) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error("Firebase is not configured.");
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

