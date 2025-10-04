import React from 'react';
import { X, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/products');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-primary-light" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  سلة التسوق
                </h2>
                {cartItems.length > 0 && (
                  <span className="bg-secondary text-white text-sm px-2 py-1 rounded-full">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    سلة التسوق فارغة
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    ابدأ بالتسوق لإضافة منتجات إلى سلة التسوق
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="btn-primary"
                  >
                    <ArrowLeft className="h-5 w-5 ml-2" />
                    ابدأ بالتسوق
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.productId}`}
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={(quantity) => 
                        updateQuantity(item.productId, quantity)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">المجموع الفرعي:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {subtotal.toFixed(2)} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span className="text-gray-900 dark:text-gray-100">المجموع الكلي:</span>
                    <span className="text-primary-light">
                      {total.toFixed(2)} ج.م
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary"
                  >
                    إتمام الطلب
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="w-full btn-secondary"
                  >
                    <ArrowLeft className="h-5 w-5 ml-2" />
                    متابعة التسوق
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar; 