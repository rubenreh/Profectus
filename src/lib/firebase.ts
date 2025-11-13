import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Only access env vars on client side to prevent SSR issues
const getFirebaseConfig = () => {
  if (typeof window === "undefined") {
    return null;
  }
  
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Validate config
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    return null;
  }

  return config;
};

const isBrowser = typeof window !== "undefined";

let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  // Never initialize on server
  if (!isBrowser) {
    return null;
  }

  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  if (!firebaseApp) {
    const existingApps = getApps();
    if (existingApps.length === 0) {
      try {
        firebaseApp = initializeApp(config);
      } catch (error) {
        console.error("Firebase initialization error:", error);
        return null;
      }
    } else {
      firebaseApp = existingApps[0];
    }
  }

  return firebaseApp;
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  authInstance = getAuth(app);
  return authInstance;
}

export function getFirestoreClient(): Firestore | null {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  firestoreInstance = getFirestore(app);
  return firestoreInstance;
}

export function isFirebaseReady() {
  return Boolean(getFirebaseApp());
}

export default getFirebaseApp;

