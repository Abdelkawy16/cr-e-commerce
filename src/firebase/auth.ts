import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Create admin user
export const createAdminUser = async (email: string, password: string): Promise<void> => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create the user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    
    console.log('Admin user created successfully');
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    throw new Error(error.message);
  }
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // If you decide later to restrict admin access to specific users, re-implement the check here.
    // For now, any successful login will proceed.
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in:', error);
    // Return a rejected promise with the error message for AuthContext to handle
    return Promise.reject(new Error(error.message));
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 