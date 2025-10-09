import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CategoryCard from '../../components/common/CategoryCard';
import { getCategories } from '../../firebase/categories';
import { Category } from '../../types';
import { motion } from 'framer-motion';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        // Filter to only show main categories (no parentId)
        const mainCategories = categoriesData.filter(category => !category.parentId);
        setCategories(mainCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  return (
    <Layout>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-12 transition-all duration-500">
        <div className="container mx-auto px-6">
          <motion.h1 
            className="text-4xl font-bold text-blue-600 dark:text-blue-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Browse Categories
          </motion.h1>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  <CategoryCard category={category} />
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
              <p className="text-xl text-gray-600 dark:text-gray-300">No categories available at the moment.</p>
              <a
                href="/products"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold transition-colors duration-300"
              >
                Explore Products
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;