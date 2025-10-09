import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../firebase/orders';

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
      toast.success('Your order has been placed successfully!');
      
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
      <div className="bg-gray-100 py-8 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 dark:bg-gray-800 transition-colors duration-300">
            <div className="text-center mb-8">
              <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-100">Order Confirmation</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please review your order details before submitting
              </p>
            </div>
            
            {/* Order summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b dark:border-gray-700 dark:text-gray-100">Order Summary</h2>
              
              {/* Products */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 text-gray-900 dark:text-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span>Size: {item.selectedSize}</span>
                        <span className="mx-2">|</span>
                        <span>Color: {item.selectedColor}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{(item.price * item.quantity).toFixed(2)} EGP</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{item.quantity} × {item.price} EGP</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                
                <div className="border-t pt-2 dark:border-gray-700">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)} EGP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping info */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b dark:border-gray-700 dark:text-gray-100">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1 dark:text-gray-300">Name</h3>
                  <p>{customer.name}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1 dark:text-gray-300">Phone Number</h3>
                  <p>{customer.phone}</p>
                </div>
                
                {customer.comment && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-1 dark:text-gray-300">Additional Notes</h3>
                    <p>{customer.comment}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleCreateOrder}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-md transition-colors duration-300 dark:bg-secondary-dark dark:hover:bg-secondary"
              >
                <Send size={20} />
                Confirm Order
              </button>
              
              <button 
                onClick={() => navigate('/cart')}
                className="py-3 px-6 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors duration-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;