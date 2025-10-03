import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAhmaoCWoh7o0vViHf9Kz25RfMbydh0prQ",
  authDomain: "e-commerce-46f71.firebaseapp.com",
  projectId: "e-commerce-46f71",
  storageBucket: "e-commerce-46f71.firebasestorage.app",
  messagingSenderId: "1095341314468",
  appId: "1:1095341314468:web:2e24708317eaa0dbb13131",
  measurementId: "G-2GWTJ9M82W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;