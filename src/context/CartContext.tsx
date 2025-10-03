import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Customer, PickupLocation } from '../types';
import { getPickupLocation } from '../firebase/settings';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  pickupLocation: PickupLocation | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Ensure all prices are numbers
      return parsedCart.map((item: any) => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
      }));
    }
    return [];
  });
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<PickupLocation | null>(null);

  // Fetch pickup location
  useEffect(() => {
    const fetchPickupLocation = async () => {
      try {
        const location = await getPickupLocation();
        setPickupLocation(location);
      } catch (error) {
        console.error('Error fetching pickup location:', error);
      }
    };
    fetchPickupLocation();
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate total including delivery
  const total = subtotal;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(i => i.productId === item.productId && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor);
      if (existingItem) {
        return prevItems.map(i =>
          i.productId === item.productId && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
    // Open sidebar when item is added
    setIsSidebarOpen(true);
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColor: string) => {
    setCartItems((prevItems) => prevItems.filter(item => !(item.productId === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId: string, selectedSize: string, selectedColor: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.productId === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomer(null);
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    customer,
    setCustomer,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    pickupLocation,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};