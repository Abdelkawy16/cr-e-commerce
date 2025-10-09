import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CategoryCard from '../../components/common/CategoryCard';
import { getCategories } from '../../firebase/categories';
import { Category } from '../../types';

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
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 py-8 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-gray-100 transition-colors duration-300">Browse Categories</h1>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No products match your search</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;