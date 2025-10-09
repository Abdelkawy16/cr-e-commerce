import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { calculateDiscountedPrice, getActiveDiscount } from '../../utils/validation';
import toast from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    // Ensure price is a number
    const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
    const activeDiscount = getActiveDiscount(product);
    const finalPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : price;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: price,
      discountPercentage: activeDiscount || 0,
      image: product.images?.[0] || product.image || '',
      quantity: 1,

      categoryId: product.categoryId
    });
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">المفضلة</h1>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {favorites.length} منتج
              </span>
            </div>
          </div>

          {favorites.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                قائمة المفضلة فارغة
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                قم بإضافة منتجات إلى المفضلة لتظهر هنا
              </p>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-light"
              >
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-square">
                    <img
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </Link>
                  <div className="p-4 space-y-4">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-light"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        {(() => {
                          // Ensure price is a number
                          const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
                          const activeDiscount = getActiveDiscount(product);
                          const discountedPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : null;
                          
                          return (
                            <>
                              {discountedPrice ? (
                                <>
                                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {discountedPrice.toFixed(2)} €
                                  </span>
                                  <span className="text-lg font-medium text-gray-500 line-through dark:text-gray-400">
                                    {price.toFixed(2)} €
                                  </span>
                                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
                                    -{activeDiscount}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                  {price.toFixed(2)} €
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-light"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to cart
                        <ShoppingCart size={20} />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          removeFromFavorites(product.id);
                          toast.success('تمت إزالة المنتج من المفضلة');
                        }}
                        className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-6 h-6 fill-current" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default FavoritesPage; 