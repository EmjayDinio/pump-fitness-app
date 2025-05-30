import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWrAeaX4-zBwxGiGrTfGKPi4Z0ETJLrxw",
  authDomain: "pump-368ca.firebaseapp.com",
  projectId: "pump-368ca",
  storageBucket: "pump-368ca.firebasestorage.app",
  messagingSenderId: "360782749212",
  appId: "1:360782749212:web:5a442d764bb9cbdd7009d9",
  measurementId: "G-VFBTTBKCBQ"
};

const app = initializeApp(firebaseConfig);

// For React Native, you might need to use initializeAuth instead of getAuth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  
});

export const db = getFirestore(app);
export const storage = getStorage(app);