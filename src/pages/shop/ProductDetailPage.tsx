import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Play, Heart, Share2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import ImageLightbox from '../../components/common/ImageLightbox';
import VideoPlayer from '../../components/common/VideoPlayer';
import { getProductById } from '../../firebase/products';
import { getCategoryById } from '../../firebase/categories';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Product, Category } from '../../types';
import { calculateDiscountedPrice, getActiveDiscount } from '../../utils/validation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  // GSAP refs
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          // Set initial active image to the first image
          setActiveImageIndex(0);
          
          // Fetch category
          if (productData.categoryId) {
            const categoryData = await getCategoryById(productData.categoryId);
            setCategory(categoryData);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    // Animate main image
    if (mainImageRef.current) {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
    // Animate thumbnails
    if (thumbnailsRef.current) {
      gsap.fromTo(
        thumbnailsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    }
    // Animate info section on scroll
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 80%',
          },
        }
      );
    }
    // Animate actions (add to cart, etc) on scroll
    if (actionsRef.current) {
      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: actionsRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    

    
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
      quantity,

      categoryId: product.categoryId
    });
    
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const nextImage = () => {
    if (!product) return;
    const images = product.images || [product.image];
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!product) return;
    const images = product.images || [product.image];
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      const productUrl = `${window.location.origin}/product/${id}`;
      await navigator.clipboard.writeText(productUrl);
      toast.success('تم نسخ رابط المنتج');
    } catch (err) {
      toast.error('حدث خطأ أثناء نسخ الرابط');
    }
  };

  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(product?.name || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success('تم نسخ اسم المنتج');
    } catch (err) {
      toast.error('حدث خطأ أثناء النسخ');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-gray-900 dark:text-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">المنتج غير موجود</h1>
            <Link to="/products" className="mt-4 inline-block text-primary-light hover:text-primary-light-dark dark:text-primary-light dark:hover:text-secondary">
              العودة إلى المنتجات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images || [product.image];

  return (
    <Layout>
      <motion.div 
        className="container mx-auto px-4 py-16 text-gray-900 dark:text-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div className="space-y-6" ref={mainImageRef} variants={itemVariants}>
            {/* Main Image or Video */}
            <div className="relative">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div 
                  className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
                  onClick={() => !showVideo && setIsLightboxOpen(true)}
                >
                  {showVideo ? (
                    <div className="relative w-full h-full">
                      <VideoPlayer 
                        url={product.video || ''} 
                        title={product.name}
                        type={product.videoType}
                      />
                      <button
                        onClick={() => setShowVideo(false)}
                        className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    </div>
                  ) : (
                    <img
                      src={images[activeImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  )}
                  {(() => {
                    const activeDiscount = getActiveDiscount(product);
                    if (activeDiscount && !showVideo) {
                      return (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                          className="absolute top-4 left-4 z-20"
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
                </div>
                {/* Carousel Dots */}
                {!showVideo && images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full border border-primary-light dark:border-primary-dark transition-all ${
                          idx === activeImageIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Thumbnails */}
            <motion.div 
              className="grid grid-cols-4 gap-4"
              ref={thumbnailsRef}
              variants={itemVariants}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setShowVideo(false);
                    setActiveImageIndex(index);
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-100 dark:bg-gray-700 transform hover:scale-105 ${
                    index === activeImageIndex && !showVideo
                      ? 'border-primary dark:border-primary-light shadow-lg'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
              {product.video && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-100 dark:bg-gray-700 transform hover:scale-105 ${
                    showVideo
                      ? 'border-primary dark:border-primary-light shadow-lg'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary dark:text-primary-dark" />
                    </div>
                  </div>
                  <img
                    src={product.images?.[0] || product.image}
                    alt={`${product.name} - Video`}
                    className="w-full h-full object-contain p-1 opacity-50"
                  />
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div className="space-y-8" ref={infoRef} variants={itemVariants}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
                  <button
                    onClick={handleCopyName}
                    className={`ml-2 p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${copied ? 'ring-2 ring-primary' : ''}`}
                    title="نسخ اسم المنتج"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-primary' : 'text-gray-500 dark:text-gray-300'}`} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <motion.button 
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite(product.id)
                        ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      if (isFavorite(product.id)) {
                        removeFromFavorites(product.id);
                        toast.success('تمت إزالة المنتج من المفضلة');
                      } else {
                        addToFavorites(product);
                        toast.success('تمت إضافة المنتج إلى المفضلة');
                      }
                    }}
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
                  <motion.button 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    onClick={handleShare}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <span className="inline-block bg-secondary text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">مميز</span>
                )}
                {product.brand && (
                  <div
                    className="inline-flex items-center text-[11px] font-medium bg-blue-500/10 dark:bg-blue-900/20 text-blue-500 dark:text-blue-500 px-2 py-0.5 rounded-full mr-1 hover:bg-blue-500/20 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span>{product.brand}</span>
                  </div>
                )}
                {category && (
                  <Link
                    to={`/products?category=${category.id}`}
                    className="inline-flex items-center text-[11px] font-medium bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-light px-2 py-0.5 rounded-full mr-1 hover:bg-primary-light/20 dark:hover:bg-primary-dark/30 transition-colors"
                  >
                    <span>{category.name}</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {(() => {
                // Ensure price is a number
                const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
                const activeDiscount = getActiveDiscount(product);
                const discountedPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : null;
                
                return (
                  <>
                    {discountedPrice ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {discountedPrice.toFixed(2)} €
                          </span>
                          <span className="text-lg font-medium text-gray-500 line-through dark:text-gray-400">
                            {price.toFixed(2)} €
                          </span>
                        </div>
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white text-lg px-6 py-4 rounded-2xl font-bold shadow-2xl transform -rotate-12 border-4 border-white">
                            <div className="flex flex-col items-center">
                              <span className="text-sm leading-tight">خصم</span>
                              <span className="text-2xl font-black">{activeDiscount}%-</span>
                            </div>
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                        </motion.div>
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

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{product.description}</p>


            {/* Quantity */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2 dark:text-gray-100">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <motion.button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-dark/40"
                    whileTap={{ scale: 0.93 }}
                  >
                    -
                  </motion.button>
                  <span className="w-10 text-center font-medium text-gray-900 dark:text-gray-100 text-sm">{quantity}</span>
                  <motion.button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-dark/40"
                    whileTap={{ scale: 0.93 }}
                  >
                    +
                  </motion.button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">In Stock</span>
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-light shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart size={20} />
              إضافة إلى السلة
            </motion.button>
          </motion.div>
        </div>

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={images.filter(Boolean) as string[]}
          currentIndex={activeImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </motion.div>
    </Layout>
  );
};

export default ProductDetailPage;