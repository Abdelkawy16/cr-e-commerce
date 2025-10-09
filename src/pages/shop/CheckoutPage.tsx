import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../firebase/orders';
import { motion } from 'framer-motion';

const CheckoutPage: React.FC = () => {
  const { cartItems, customer, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if no customer data or empty cart
  React.useEffect(() => {
    if (!customer || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [customer, cartItems, navigate]);

  if (!customer || cartItems.length === 0) {
    return null;
  }

  const handleCreateOrder = async () => {
    try {
      // Create order in Firebase
      await createOrder(cartItems, customer, total);
      
      // Clear cart and show success message
      clearCart();
      toast.success('Your order has been placed successfully!', { duration: 3000 });
      
      // Redirect to home page after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while creating your order');
    }
  };

  return (
    <Layout>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-12 transition-all duration-500">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-200/50 dark:border-blue-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-300 mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">Order Confirmation</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please review your order details before submitting
              </p>
            </div>
            
            {/* Order Summary */}
            <div className="mb-8">
              <motion.h2 
                className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-blue-800 text-blue-600 dark:text-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Order Summary
              </motion.h2>
              
              {/* Products */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={`${item.productId}`}
                    className="flex gap-4 text-gray-900 dark:text-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600 dark:text-blue-300">{(item.price * item.quantity).toFixed(2)} €</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{item.quantity} × {item.price} €</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="space-y-2 border-t border-gray-200 dark:border-blue-800 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                
                <div className="border-t pt-2 border-gray-200 dark:border-blue-800">
                  <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-300">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Info */}
            <div className="mb-8">
              <motion.h2 
                className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-blue-800 text-blue-600 dark:text-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Shipping Information
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</h3>
                  <p className="text-gray-600 dark:text-gray-300">{customer.name}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</h3>
                  <p className="text-gray-600 dark:text-gray-300">{customer.phone}</p>
                </div>
                
                {customer.comment && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Additional Notes</h3>
                    <p className="text-gray-600 dark:text-gray-300">{customer.comment}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-4">
              <motion.button 
                onClick={handleCreateOrder}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-full transition-all duration-300 hover:bg-cyan-500 dark:hover:bg-cyan-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
                Confirm Order
              </motion.button>
              
              <motion.button 
                onClick={() => navigate('/cart')}
                className="py-3 px-6 border border-gray-300 dark:border-blue-800 text-gray-700 dark:text-gray-200 font-bold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Edit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;