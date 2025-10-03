import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/common/ProductCard';
import ImageLightbox from '../../components/common/ImageLightbox';
import { getCategoryById, getSubcategories } from '../../firebase/categories';
import { getProductsByCategory } from '../../firebase/products';
import { Category, Product } from '../../types';

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
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">الفئة غير موجودة</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">عذراً، لم يتم العثور على الفئة المطلوبة</p>
          <Link 
            to="/categories" 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 dark:bg-primary-dark dark:hover:bg-primary"
          >
            العودة إلى الفئات
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div 
            className="mb-8 relative h-64 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700 cursor-pointer group shadow-xl hover:shadow-2xl transition-shadow duration-500"
            style={{ perspective: '800px' }}
            onClick={() => {
              setCurrentImage(category.image || 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/featuredimage-10.jpg');
              setIsLightboxOpen(true);
            }}
          >
            <img 
              src={category.image || 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/featuredimage-10.jpg'} 
              alt={category.name} 
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg group-hover:rotate-1"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h1 className="text-3xl font-extrabold mb-2 drop-shadow-lg tracking-tight">{category.name}</h1>
              <p className="text-gray-200 drop-shadow-md">{category.description}</p>
            </div>
            <div className="absolute -inset-2 rounded-3xl border-4 border-primary/30 dark:border-primary-dark/40 pointer-events-none animate-pulse group-hover:animate-none" />
          </div>
          
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 space-x-reverse">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-light">
                    الرئيسية
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                  <Link to="/categories" className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-light">
                    الفئات
                  </Link>
                </li>
                {category.parentId && (
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                    <Link to={`/category/${category.parentId}`} className="text-gray-600 hover:text-primary-light dark:text-gray-300 dark:hover:text-primary-light">
                      الفئة الأب
                    </Link>
                  </li>
                )}
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-gray-800 dark:text-gray-100">{category.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Subcategories Section */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">الفئات الفرعية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map(subcategory => (
                  <Link 
                    key={subcategory.id}
                    to={`/category/${subcategory.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                      <img 
                        src={subcategory.image || 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/featuredimage-10.jpg'} 
                        alt={subcategory.name} 
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-xl font-bold">{subcategory.name}</h3>
                        {subcategory.description && (
                          <p className="mt-1 text-sm text-gray-200 line-clamp-2">{subcategory.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">المنتجات</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-300">لا توجد منتجات في هذه الفئة</p>
              </div>
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