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
    
    // Validate phone number
    const phoneError = getPhoneErrorMessage(formData.phone);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }
    
    // Format phone number before saving
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
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 11 digits
      const limitedDigits = digitsOnly.slice(0, 11);
      
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
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 dark:bg-gray-700">
              <ShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">سلة المشتريات فارغة</h1>
            <p className="text-gray-600 mb-8 dark:text-gray-300">لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد</p>
            <Link 
              to="/products" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>تصفح المنتجات</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title mb-8 text-gray-800 dark:text-gray-100">سلة المشتريات</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                  item={item}
                  onRemove={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                  onUpdateQuantity={(quantity: number) => updateQuantity(item.productId, item.selectedSize, item.selectedColor, quantity)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b dark:border-gray-700">ملخص الطلب</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>

                  <div className="border-t pt-4 dark:border-gray-700">
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي</span>
                      <span>{total.toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  {pickupLocation && (
                    <div className="bg-primary/5 p-4 rounded-lg dark:bg-primary-dark/20">
                      <h3 className="font-medium text-primary dark:text-primary-light mb-2">موقع الاستلام:</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{pickupLocation.address}</p>
                      <button
                        onClick={() => {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${pickupLocation.latitude},${pickupLocation.longitude}`, '_blank');
                        }}
                        className="text-primary hover:text-primary-dark text-sm flex items-center gap-1 mt-2"
                      >
                        <MapPin size={14} />
                        عرض على الخريطة
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full text-center mt-6 flex items-center justify-center gap-2"
                  >
                    <span>متابعة الشراء</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    to="/products"
                    className="text-center block text-gray-600 hover:text-primary-light mt-4 transition-colors dark:text-gray-300 dark:text-primary-lightrimary-light-light"
                  >
                    متابعة التسوق
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form Modal */}
          {showCustomerForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full dark:bg-gray-800"
              >
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">معلومات التوصيل</h2>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      مثال: 01012345678
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                      placeholder="أي تفاصيل إضافية تخص الطلب أو التوصيل..."
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      متابعة
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      إلغاء
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