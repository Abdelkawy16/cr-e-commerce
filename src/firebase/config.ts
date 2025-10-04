import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBtE4OOrfCi0rssdJGbJA341ZZ9w7YqxIs",
  authDomain: "croatia-db.firebaseapp.com",
  projectId: "croatia-db",
  storageBucket: "croatia-db.firebasestorage.app",
  messagingSenderId: "1048613128897",
  appId: "1:1048613128897:web:a178af4514dd7acc43e240",
  measurementId: "G-X4GHVBMDTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;