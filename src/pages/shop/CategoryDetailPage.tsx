import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/common/ProductCard';
import ImageLightbox from '../../components/common/ImageLightbox';
import { getCategoryById, getSubcategories } from '../../firebase/categories';
import { getProductsByCategory } from '../../firebase/products';
import { Category, Product } from '../../types';
import { motion } from 'framer-motion';

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!id) return;
      
      try {
        const [categoryData, subcategoriesData, productsData] = await Promise.all([
          getCategoryById(id),
          getSubcategories(id),
          getProductsByCategory(id)
        ]);
        
        setCategory(categoryData);
        setSubcategories(subcategoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16">
          <div className="flex justify-center items-center h-64">
            <motion.div 
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4">Category Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Sorry, the requested category could not be found.</p>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-all duration-300"
            >
              Back to Categories
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-12 transition-all duration-500">
        <div className="container mx-auto px-6">
          {/* Category Header */}
          <motion.div 
            className="mb-8 relative h-64 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer group shadow-xl hover:shadow-2xl transition-shadow duration-500"
            style={{ perspective: '800px' }}
            onClick={() => {
              setCurrentImage(category.image || 'https://via.placeholder.com/800x400?text=Category+Image');
              setIsLightboxOpen(true);
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={category.image || 'https://via.placeholder.com/800x400?text=Category+Image'} 
              alt={category.name} 
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg group-hover:rotate-1"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h1 className="text-3xl font-extrabold mb-2 drop-shadow-lg tracking-tight">{category.name}</h1>
              <p className="text-gray-200 drop-shadow-md line-clamp-2">{category.description}</p>
            </div>
            <motion.div 
              className="absolute -inset-2 rounded-3xl border-4 border-blue-500/30 dark:border-blue-700/40 pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 space-x-reverse">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                    Categories
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-blue-600 dark:text-blue-300">{category.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Subcategories Section */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <motion.h2 
                className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Subcategories
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map(subcategory => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 100 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  >
                    <Link 
                      to={`/category/${subcategory.id}`}
                      className="block bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                        <img 
                          src={subcategory.image || 'https://via.placeholder.com/400x300?text=Subcategory+Image'} 
                          alt={subcategory.name} 
                          className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-bold">{subcategory.name}</h3>
                          {subcategory.description && (
                            <p className="mt-1 text-sm text-gray-200 line-clamp-2">{subcategory.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div>
            <motion.h2 
              className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Products
            </motion.h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 100 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-gray-600 dark:text-gray-300">No products available in this category.</p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold transition-colors duration-300"
                >
                  Explore All Products
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={[currentImage]}
        currentIndex={0}
        onNext={() => {}}
        onPrev={() => {}}
      />
    </Layout>
  );
};

export default CategoryDetailPage;