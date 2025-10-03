import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, enableNetwork, disableNetwork, onSnapshotsInSync } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { signIn, signOut, isUserAdmin } from '../firebase/auth';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isOnline: boolean;
  retryConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  // Monitor Firestore connection
  useEffect(() => {
    const unsubscribe = onSnapshotsInSync(db, () => {
      setIsFirestoreConnected(true);
    });

    return () => unsubscribe();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      try {
        await enableNetwork(db);
        setIsFirestoreConnected(true);
      } catch (error) {
        console.error('Error enabling network:', error);
      }
    };

    const handleOffline = async () => {
      setIsOnline(false);
      setIsFirestoreConnected(false);
      try {
        await disableNetwork(db);
      } catch (error) {
        console.error('Error disabling network:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const retryConnection = async () => {
    try {
      setError(null);
      await enableNetwork(db);
      setIsFirestoreConnected(true);
    } catch (error) {
      console.error('Error retrying connection:', error);
      setError('فشل إعادة الاتصال. يرجى المحاولة مرة أخرى.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Assuming any successfully authenticated user via email/password is an admin for now
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          isAdmin: true, // Treat as admin
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []); // Removed isOnline and isFirestoreConnected from dependency array

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      if (!isOnline || !isFirestoreConnected) {
        throw new Error('لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
      }

      setLoading(true);
      await signIn(email, password);
      // onAuthStateChanged listener will handle setting currentUser upon successful sign-in
    } catch (err: any) {
      let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.';

      if (err.message.includes('offline') || !isFirestoreConnected) {
        errorMessage = 'لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.';
      } else if (err.message.includes('auth/user-not-found') || err.message.includes('auth/wrong-password')) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.message.includes('غير مصرح بالوصول')) {
         errorMessage = err.message;
      } else {
         errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة لاحقًا.';
      }

      console.error('Login error in AuthContext:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut();
    } catch (err) {
      setError('فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.');
      console.error(err);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isOnline,
    retryConnection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};