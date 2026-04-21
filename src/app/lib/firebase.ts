import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyApKBnyLTZe1kyKhur9wGxGL_Y9eSgZg34",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "project-girldad.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-girldad",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "project-girldad.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "79984050149",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:79984050149:web:5e73dfa1fa520c027af90c"
};

// Defensive check to prevent Firebase from crashing Next.js' static prerendering build engine
const app = typeof window !== 'undefined' && !getApps().length && firebaseConfig.apiKey 
  ? initializeApp(firebaseConfig) 
  : getApps().length ? getApp() : null as any;
const db = app ? getFirestore(app) : null as any;
const auth = app ? getAuth(app) : null as any;
const googleProvider = app ? new GoogleAuthProvider() : null as any;

export { db, auth, googleProvider };
