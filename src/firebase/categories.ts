import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
// Remove unused Storage imports
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from './config'; // Remove storage import
import { Category } from '../types';

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
};

// Get subcategories for a specific category
export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, where('parentId', '==', parentId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
};

// Get a single category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, 'categories', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Category;
  }
  
  return null;
};

// Add a new category - accepts image URL directly
export const addCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'image'>,
  imageUrl: string, // Accept image URL string
  parentId?: string // Optional parent category ID
): Promise<string> => {
  // Add category to Firestore with the provided image URL and parent ID
  const docRef = await addDoc(collection(db, 'categories'), {
    ...category,
    image: imageUrl,
    parentId: parentId || null,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
};

// Update a category - accepts optional image URL
export const updateCategory = async (
  id: string, 
  category: Partial<Omit<Category, 'id' | 'createdAt' | 'image'>>,
  imageUrl?: string, // Accept optional image URL string
  parentId?: string // Optional parent category ID
): Promise<void> => {
  const categoryRef = doc(db, 'categories', id);
  
  // Prepare update data - include image URL and parent ID if provided
  const updateData: any = { ...category };
  if (imageUrl !== undefined) {
    updateData.image = imageUrl;
  }
  if (parentId !== undefined) {
    updateData.parentId = parentId || null;
  }
  
  // Update category in Firestore
  await updateDoc(categoryRef, updateData);
};

// Delete a category - no longer needs to delete image from Storage
export const deleteCategory = async (id: string): Promise<void> => {
  // Delete category from Firestore
  const categoryRef = doc(db, 'categories', id);
  await deleteDoc(categoryRef);
  
  // No image deletion needed from Storage
};

// Check if category has products
export const categoryHasProducts = async (categoryId: string): Promise<boolean> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  
  return !snapshot.empty;
};

// Check if category has subcategories
export const categoryHasSubcategories = async (categoryId: string): Promise<boolean> => {
  const subcategories = await getSubcategories(categoryId);
  return subcategories.length > 0;
};