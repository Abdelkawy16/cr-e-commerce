import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/common/ProductCard';
import { getProducts } from '../../firebase/products';
import { getCategories } from '../../firebase/categories';
import { Product, Category } from '../../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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

  return (
    <Layout>
      <div className="bg-gray-100 py-8 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-gray-100 transition-colors duration-300">جميع المنتجات</h1>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 px-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              </div>
              
              <button
                onClick={toggleFilters}
                className="md:hidden flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <Filter size={20} />
                <span>الفلاتر</span>
              </button>
              
              <div className="hidden md:block">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="dark:bg-gray-700 dark:text-gray-200">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Mobile filters */}
            {showFilters && (
              <div className="md:hidden bg-white p-4 rounded-md shadow-md mb-4 dark:bg-gray-800">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 dark:text-gray-300">الفئة</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  >
                    <option value="">جميع الفئات</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="dark:bg-gray-700 dark:text-gray-200">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">لا توجد منتجات متطابقة مع البحث</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;