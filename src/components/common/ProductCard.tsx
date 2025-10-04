import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Product } from '../../types';
import { calculateDiscountedPrice, getActiveDiscount } from '../../utils/validation';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
          },
        }
      );
      // GSAP hover effect
      const el = cardRef.current;
      const onEnter = () => {
        gsap.to(el, { scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', duration: 0.3, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(el, { scale: 1, boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)', duration: 0.3, ease: 'power2.inOut' });
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    }
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation(); // Prevent event bubbling


    
    // Ensure price is a number
    const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
    const activeDiscount = getActiveDiscount(product);
    const finalPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : price;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: price,
      discountPercentage: activeDiscount || undefined,
      image: product.images?.[0] || product.image || '',
      quantity: 1,

      categoryId: product.categoryId
    });
    
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation(); // Prevent event bubbling

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success('تمت إزالة المنتج من المفضلة');
    } else {
      addToFavorites(product);
      toast.success('تمت إضافة المنتج إلى المفضلة');
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`card h-full bg-white dark:bg-gray-800 transition-colors duration-300 ${
        getActiveDiscount(product) ? 'ring-2 ring-red-200 dark:ring-red-800 shadow-lg' : ''
      }`}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden pb-[100%] bg-gray-100 dark:bg-gray-700">
          <img 
            src={product.image} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded">
              مميز
            </span>
          )}
          {(() => {
            const activeDiscount = getActiveDiscount(product);
            if (activeDiscount) {
              return (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="absolute top-2 left-2 z-10"
                >
                  <div className="relative">
                    <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white text-xs px-3 py-2 rounded-lg font-bold shadow-xl transform -rotate-12 border-2 border-white">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] leading-tight">خصم</span>
                        <span className="text-sm font-black">{activeDiscount}%-</span>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </motion.div>
              );
            }
            return null;
          })()}
          {product.brand && (
            <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {product.brand}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">{product.name}</h3>
          <div className="mt-2">
            {(() => {
              const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
              const activeDiscount = getActiveDiscount(product);
              const discountedPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : null;
              
              return (
                <div className="flex items-center gap-2">
                  {discountedPrice ? (
                    <div className="flex flex-col">
                      <span className="text-primary-light font-bold text-lg dark:text-primary-light transition-colors duration-300">
                        {discountedPrice.toFixed(2)} ج.م
                      </span>
                      <span className="text-gray-500 line-through text-sm dark:text-gray-400">
                        {price.toFixed(2)} ج.م
                      </span>
                    </div>
                  ) : (
                    <span className="text-primary-light font-bold text-lg dark:text-primary-light transition-colors duration-300">
                      {price.toFixed(2)} ج.م
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-light hover:bg-primary-light text-white rounded-md transition-colors duration-300 dark:bg-primary-dark dark:hover:bg-primary-light"
        >
          <ShoppingCart size={20} />
          إضافة إلى السلة
        </button>
        <motion.button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-md transition-colors ${
            isFavorite(product.id)
              ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`w-5 h-5 ${
              isFavorite(product.id)
                ? 'text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400'
                : 'text-gray-600 dark:text-gray-300'
            }`} 
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;