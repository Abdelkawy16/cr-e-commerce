export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  video?: string; // YouTube/Vimeo URL or MP4 file URL
  videoType?: 'youtube' | 'vimeo' | 'mp4'; // Type of video
  price: number;
  discountPercentage?: number; // Discount percentage (0-100)
  discountEndDate?: Date; // When the discount expires
  categoryId: string;
  featured?: boolean;
  inStock?: boolean;
  createdAt: Date;
  order?: number; // Order index for manual sorting
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  parentId?: string;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number; // This will be the final price (discounted if applicable)
  originalPrice: number; // Original price before discount
  discountPercentage?: number; // Discount percentage applied
  image: string;
  quantity: number;
  categoryId: string;
}

export interface Customer {
  name: string;
  phone: string;
  comment?: string;
}

export interface PickupLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  status: 'waiting' | 'confirmed' | 'shipped' | 'received' | 'rejected' | 'cancelled';
  pickupLocation: PickupLocation;
  createdAt: Date;
  lastStatusChange: Date;
  comment?: string;
}

export type User = {
  uid: string;
  email: string;
  isAdmin: boolean;
};