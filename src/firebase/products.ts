import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
// Remove unused Storage imports
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from './config'; // Remove storage import
import { Product } from '../types';

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
  // Sort by 'order' if present, otherwise fallback to createdAt
  return products.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order;
    }
    if (typeof a.order === 'number') return -1;
    if (typeof b.order === 'number') return 1;
    return (a.createdAt as any)?.toMillis?.() - (b.createdAt as any)?.toMillis?.();
  });
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Product;
  }
  
  return null;
};

// Add a new product - accepts image URLs directly
export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'image' | 'images'>,
  imageUrls: string[] // Accept array of image URLs
): Promise<string> => {
  // Ensure we have at least one image URL
  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('At least one image is required');
  }
  
  // Add product to Firestore with the provided image URLs
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    images: imageUrls,
    image: imageUrls[0], // Keep the first image as the main image for backward compatibility
    createdAt: serverTimestamp(),
    order: product.order ?? null, // Add order field if provided
  });
  
  return docRef.id;
};

// Update a product - accepts optional image URLs
export const updateProduct = async (
  id: string, 
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'image' | 'images'>>,
  imageUrls?: string[] // Accept optional array of image URLs
): Promise<void> => {
  const productRef = doc(db, 'products', id);
  
  // Prepare update data - include image URLs if provided
  const updateData: any = { ...product };
  if (imageUrls !== undefined) { // Check if imageUrls is explicitly provided
    if (imageUrls.length === 0) {
      throw new Error('At least one image is required');
    }
    updateData.images = imageUrls;
    updateData.image = imageUrls[0]; // Keep the first image as the main image for backward compatibility
  }
  // Ensure order is updated if provided
  if (product.order !== undefined) {
    updateData.order = product.order;
  }
  
  // Update product in Firestore
  await updateDoc(productRef, updateData);
};

// Delete a product - no longer needs to delete image from Storage
export const deleteProduct = async (id: string): Promise<void> => {
  // Delete product from Firestore
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
  
  // No image deletion needed from Storage
};