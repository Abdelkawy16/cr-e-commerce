import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { PickupLocation } from '../types';

// Get pickup location settings
export const getPickupLocation = async (): Promise<PickupLocation | null> => {
  try {
    const docRef = doc(db, 'settings', 'pickup');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as PickupLocation;
  } catch (error) {
    console.error('Error getting pickup location:', error);
    throw error;
  }
};

// Update pickup location settings
export const updatePickupLocation = async (location: PickupLocation): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'pickup');
    await setDoc(docRef, location);
  } catch (error) {
    console.error('Error updating pickup location:', error);
    throw error;
  }
};