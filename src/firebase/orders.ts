import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { Order, CartItem, Customer } from '../types';

// Create a new order
export const createOrder = async (items: CartItem[], customer: Customer, total: number): Promise<string> => {
  try {
    const now = Timestamp.now();
    const orderData: any = {
      items,
      customer,
      total,
      status: 'waiting',
      createdAt: now,
      lastStatusChange: now
    };
    if (customer.comment) {
      orderData.comment = customer.comment;
    }
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastStatusChange: data.lastStatusChange ? data.lastStatusChange.toDate() : data.createdAt.toDate()
      } as Order;
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Get a single order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastStatusChange: data.lastStatusChange ? data.lastStatusChange.toDate() : data.createdAt.toDate()
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: 'waiting' | 'confirmed' | 'shipped' | 'received' | 'rejected' | 'cancelled'): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { 
      status,
      lastStatusChange: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}; 