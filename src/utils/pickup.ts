import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface PickupLocationSettings {
  latitude: number;
  longitude: number;
  address: string;
}

export const getPickupLocation = async (): Promise<PickupLocationSettings | null> => {
  try {
    const docRef = doc(db, 'settings', 'pickup');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as PickupLocationSettings;
  } catch (error) {
    console.error('Error getting pickup location:', error);
    return null;
  }
}; 