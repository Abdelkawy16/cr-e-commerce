import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string, selectedSize: string, selectedColor: string) => void;
  onUpdateQuantity: (quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  // Ensure price is a number
  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
  const subtotal = price * item.quantity;

  return (
    <motion.div 
      className="card p-2 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center gap-2">
        {/* Product Image */}
        <Link to={`/product/${item.productId}`} className="w-16 h-16 flex-shrink-0 relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-lg flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(item.productId, item.selectedSize, item.selectedColor);
              }}
              className="p-1 text-white hover:text-error hover:bg-white/20 rounded-full transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-grow">
          <Link 
            to={`/product/${item.productId}`}
            className="font-medium text-gray-900 mb-1 hover:text-primary-light transition-colors dark:text-gray-200 dark:hover:text-primary-light block text-sm"
          >
            {item.name}
          </Link>
          <div className="text-xs text-gray-500 space-y-0.5 dark:text-gray-400">
            {item.selectedSize && (
              <p className="flex items-center gap-1">
                <span className="font-medium">Size:</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300 text-xs">{item.selectedSize}</span>
              </p>
            )}
            {item.selectedColor && (
              <p className="flex items-center gap-1">
                <span className="font-medium">Color:</span>
                <span className="bg-gray-100 px-1 py-0.5 rounded text-xs dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300">{item.selectedColor}</span>
              </p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium">Price:</span>
              {item.discountPercentage ? (
                <div className="flex items-center gap-1">
                  <span className="text-primary-light font-medium dark:text-primary-light transition-colors duration-300">
                    {price.toFixed(2)} EGP
                  </span>
                  <span className="text-gray-400 line-through text-xs dark:text-gray-500">
                    {item.originalPrice.toFixed(2)} EGP
                  </span>
                </div>
              ) : (
                <span className="text-primary-light font-medium dark:text-primary-light transition-colors duration-300">
                  {price.toFixed(2)} ج.م
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 dark:bg-gray-700 transition-colors duration-300">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-600"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
            </button>
            <span className="w-6 text-center font-medium text-gray-900 dark:text-gray-200 text-xs">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors dark:hover:bg-gray-600"
            >
              <Plus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal:</span>
            <span className="block font-bold text-primary-light dark:text-primary-light transition-colors duration-300 text-sm">{subtotal.toFixed(2)} EGP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem; 