import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/shop/CartItem';
import { motion } from 'framer-motion';
import { Customer } from '../../types';
import { formatPhoneNumber, getPhoneErrorMessage } from '../../utils/validation';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, total, customer, setCustomer, pickupLocation } = useCart();
  const navigate = useNavigate();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [formData, setFormData] = useState<Customer & { comment?: string }>({
    name: '',
    phone: '',
    comment: ''
  });

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customer) {
      setShowCustomerForm(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number (9 digits, no country code)
    const phoneError = getPhoneErrorMessage(formData.phone);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }
    
    // Format phone number with +385 prefix
    const formattedCustomer = {
      ...formData,
      phone: formatPhoneNumber(formData.phone)
    };
    
    setCustomer(formattedCustomer);
    setShowCustomerForm(false);
    navigate('/checkout');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      // Only allow digits, limit to 9 digits
      const digitsOnly = value.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 9);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedDigits
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16">
          <motion.div 
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-blue-100/50 dark:bg-blue-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-blue-600 dark:text-blue-300" />
            </div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Explore our latest gadgets and add them to your cart!</p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-all duration-300"
            >
              <span>Browse Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 text-gray-900 dark:text-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}`}
                  item={item}
                  onRemove={() => removeFromCart(item.productId)}
                  onUpdateQuantity={(quantity: number) => updateQuantity(item.productId, quantity)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-blue-800/50 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200 dark:border-blue-800 text-blue-600 dark:text-blue-300">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>

                  <div className="border-t pt-4 border-gray-200 dark:border-blue-800">
                    <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-300">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {pickupLocation && (
                    <div className="bg-blue-100/20 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-600 dark:text-blue-300 mb-2">Pickup Location:</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{pickupLocation.address}</p>
                      <button
                        onClick={() => {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${pickupLocation.latitude},${pickupLocation.longitude}`, '_blank');
                        }}
                        className="text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 text-sm flex items-center gap-1 mt-2 transition-colors duration-300"
                      >
                        <MapPin size={16} />
                        View on Map
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <Link
                    to="/products"
                    className="text-center block text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300 mt-4"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form Modal */}
          {showCustomerForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl p-6 max-w-md w-full border border-gray-200/50 dark:border-blue-800/50"
              >
                <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-300">Delivery Information</h2>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <div className="flex items-center">
                      <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-r-0 border-gray-300 dark:border-blue-800 rounded-l-lg">+385</span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="912345678"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-blue-800 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Example: 912345678
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes (Optional)</label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Any additional details about your order or delivery..."
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-all duration-300"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default CartPage;