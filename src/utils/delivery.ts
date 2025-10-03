import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface DeliverySettings {
  baseCost: number;
  freeDeliveryThreshold: number;
}

export const calculateDeliveryCost = async (orderTotal: number): Promise<number> => {
  try {
    const docRef = doc(db, 'settings', 'delivery');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return 0; // Default to free delivery if settings don't exist
    }

    const settings = docSnap.data() as DeliverySettings;
    
    // If order total is greater than or equal to the threshold, delivery is free
    if (orderTotal >= settings.freeDeliveryThreshold) {
      return 0;
    }
    
    return settings.baseCost;
  } catch (error) {
    console.error('Error calculating delivery cost:', error);
    return 0; // Default to free delivery on error
  }
}; 