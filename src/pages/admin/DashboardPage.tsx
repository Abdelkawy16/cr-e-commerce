import React, { useState, useEffect } from 'react';
import { ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getProducts } from '../../firebase/products';
import { getCategories } from '../../firebase/categories';
import { Product, Category } from '../../types';

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-100">لوحة التحكم</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 dark:bg-gray-800 dark:shadow-gray-700">
          <div className="flex items-center">
            <div className="bg-primary-light p-2 sm:p-3 rounded-full dark:bg-primary-dark">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="mr-3 sm:mr-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">المنتجات</h2>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 dark:bg-gray-800 dark:shadow-gray-700">
          <div className="flex items-center">
            <div className="bg-secondary-light p-2 sm:p-3 rounded-full dark:bg-secondary-dark">
              <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="mr-3 sm:mr-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">الفئات</h2>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 dark:bg-gray-800 dark:shadow-gray-700">
          <div className="flex items-center">
            <div className="bg-success p-2 sm:p-3 rounded-full dark:bg-success-dark">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="mr-3 sm:mr-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">منتجات مميزة</h2>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8 dark:bg-gray-800 dark:shadow-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">أحدث المنتجات</h2>
        
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {products.slice(0, 5).map((product) => {
            const category = categories.find(c => c.id === product.categoryId);
            return (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 flex-shrink-0">
                    <img className="h-12 w-12 rounded-md object-cover" src={product.image} alt={product.name} />
                  </div>
                  <div className="mr-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{product.price} €</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{category?.name || 'غير محدد'}</span>
                  {product.featured ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary-light text-secondary-dark dark:bg-secondary-dark dark:text-secondary-light">
                      مميز
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      عادي
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  المنتج
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  السعر
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  الفئة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {products.slice(0, 5).map((product) => {
                const category = categories.find(c => c.id === product.categoryId);
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.price} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {category?.name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-light text-secondary-dark dark:bg-secondary-dark dark:text-secondary-light">
                          مميز
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          عادي
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Categories */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 dark:bg-gray-800 dark:shadow-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">الفئات</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-md p-3 sm:p-4 dark:border-gray-700">
              <div className="flex items-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-md flex items-center justify-center dark:bg-gray-700">
                    <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="mr-3 sm:mr-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    {products.filter(p => p.categoryId === category.id).length} منتج
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;