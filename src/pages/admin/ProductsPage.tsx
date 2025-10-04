import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Search, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../../firebase/products';
import { getCategories } from '../../firebase/categories';
import { Product, Category } from '../../types';
import { uploadToCloudinary } from '../../config/cloudinary';
import { calculateDiscountedPrice, getActiveDiscount } from '../../utils/validation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { UniqueIdentifier } from '@dnd-kit/core';

// Sortable row component for table
function SortableRow({ id, children }: { id: UniqueIdentifier; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };
  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  );
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    discountEndDate: '',
    categoryId: '',
    brand: '',
    featured: false,
    inStock: true,
    images: [] as string[],
    video: '',
    videoType: 'youtube' as 'youtube' | 'vimeo' | 'mp4',
  });
  
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isUrlInput, setIsUrlInput] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Correctly handle checkbox type
    let newValue: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    // Always store discountPercentage and price as numbers
    if (name === 'discountPercentage' || name === 'price') {
      newValue = value === '' ? '' : Number(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageInput(e.target.files[0]);
      setIsUrlInput(false);
    }
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
    setIsUrlInput(true);
  };

  const handleAddToArray = async (type: 'sizes' | 'colors' | 'images') => {
    if (type === 'images') {
      if (isUrlInput && imageUrlInput) {
        // Add direct URL
        if (!formData.images.includes(imageUrlInput)) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrlInput]
          }));
          setImageUrlInput('');
        }
      } else if (imageInput) {
        // Upload file to Cloudinary
        try {
          setUploadingImages(true);
          const imageUrl = await uploadToCloudinary(imageInput);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
          setImageInput(null);
          // Reset the file input
          const fileInput = document.getElementById('images') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('حدث خطأ أثناء رفع الصورة');
        } finally {
          setUploadingImages(false);
        }
      }
    } else {
      const input = type === 'sizes' ? sizeInput : colorInput;
      if (input.trim() && !(formData[type].includes(input.trim()))) {
        setFormData(prev => ({
          ...prev,
          [type]: [...prev[type], input.trim()]
        }));
        if (type === 'sizes') {
          setSizeInput('');
        } else if (type === 'colors') {
          setColorInput('');
        }
      }
    }
  };

  const handleRemoveFromArray = (type: 'sizes' | 'colors' | 'images', item: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item)
    }));
  };

  // Open modal for adding a new product
  const handleAddClick = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      discountEndDate: '',
      categoryId: '',
      brand: '',
      featured: false,
      inStock: true,
      images: [],
      video: '',
      videoType: 'youtube',
      });
    setSizeInput('');
    setColorInput('');
    setImageInput(null);
    setIsModalOpen(true);
  };

  // Open modal for editing a product
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);

    let formattedDate = '';
    if (product.discountEndDate) {
      // Handle Firestore Timestamp object which has a toDate method, or a regular Date object
      if (typeof (product.discountEndDate as any).toDate === 'function') {
        formattedDate = (product.discountEndDate as any).toDate().toISOString().split('T')[0];
      } else {
        // Handle date string
        const date = new Date(product.discountEndDate);
        // Check if the date is valid before converting
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
    }

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price || 0,
      discountPercentage: product.discountPercentage || 0,
      discountEndDate: formattedDate,
      categoryId: product.categoryId || '',
      brand: product.brand || '',
      featured: product.featured || false,
      inStock: product.inStock || true,
      images: product.images || [],
      video: product.video || '',
      videoType: product.videoType || 'youtube',
    });
    setSizeInput('');
    setColorInput('');
    setImageInput(null);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build productData without discount fields
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
        brand: formData.brand,
        featured: formData.featured,
        inStock: formData.inStock,
        video: formData.video,
      };
      // Only add discountPercentage if it's a number (including 0)
      if (typeof formData.discountPercentage === 'number' && !isNaN(formData.discountPercentage)) {
        productData.discountPercentage = formData.discountPercentage;
      }
      // Only add discountEndDate if it's a valid date string
      if (formData.discountEndDate) {
        const date = new Date(formData.discountEndDate);
        if (!isNaN(date.getTime())) {
          productData.discountEndDate = date;
        }
      }

      if (selectedProduct) {
        // Update existing product
        await updateProduct(
          selectedProduct.id,
          productData,
          formData.images
        );
        toast.success('تم تحديث المنتج بنجاح!');
      } else {
        // Add new product
        await addProduct(
          productData,
          formData.images
        );
        toast.success('تمت إضافة المنتج بنجاح!');
      }
      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`حدث خطأ أثناء حفظ المنتج: ${error instanceof Error ? error.message : ''}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      toast.success('تم حذف المنتج بنجاح!');
      fetchData(); // Refresh list
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(`حدث خطأ أثناء حذف المنتج: ${error instanceof Error ? error.message : ''}`);
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: { active: { id: UniqueIdentifier }, over: { id: UniqueIdentifier } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredProducts.findIndex((p) => p.id === active.id);
    const newIndex = filteredProducts.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newProducts = arrayMove(filteredProducts, oldIndex, newIndex);
    // Update order field for all affected products
    setProducts((prev) => {
      // Only update the order for the filtered products
      const updated = prev.map((p) => {
        const idx = newProducts.findIndex((np: Product) => np.id === p.id);
        if (idx !== -1) {
          return { ...p, order: idx };
        }
        return p;
      });
      return updated;
    });
    // Persist order to Firestore
    try {
      setLoading(true);
      await Promise.all(
        newProducts.map((product: Product, idx: number) =>
          updateProduct(product.id, { order: idx })
        )
      );
      toast.success('تم تحديث ترتيب المنتجات!');
      fetchData();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الترتيب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">إدارة المنتجات</h1>
        <button
          onClick={handleAddClick}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
        >
          <Plus size={20} className="ml-2" />
          إضافة منتج جديد
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="بحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
          />
        </div>
        <div className="relative flex-1 sm:flex-none sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary appearance-none pr-8 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
          >
            <option value="">جميع الفئات</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 dark:shadow-gray-700">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 text-center p-6 dark:text-gray-300">لا توجد منتجات حاليًا تطابق معايير البحث.</p>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img className="h-16 w-16 rounded-md object-cover" src={product.images?.[0] || 'placeholder.jpg'} alt={product.name} />
                      </div>
                      <div className="mr-4 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(() => {
                            const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
                            const activeDiscount = getActiveDiscount(product);
                            const discountedPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : null;
                            
                            return (
                              <div className="flex items-center gap-2">
                                {discountedPrice ? (
                                  <>
                                    <span className="text-red-600 font-medium">
                                      {discountedPrice.toFixed(2)} ج.م
                                    </span>
                                    <span className="line-through text-gray-400">
                                      {price.toFixed(2)} ج.م
                                    </span>
                                    <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                                      -{activeDiscount}%
                                    </span>
                                  </>
                                ) : (
                                  <span>{price.toFixed(2)} ج.م</span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {(categories.find(cat => cat.id === product.categoryId)?.name) || 'غير محدد'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {product.inStock ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">
                            متوفر
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                            غير متوفر
                          </span>
                        )}
                        {product.featured && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary-light text-secondary-dark dark:bg-secondary-dark dark:text-secondary-light">
                            مميز
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">المنتج</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">السعر</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">الفئة</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">الحالة</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">الإجراءات</th>
                    </tr>
                  </thead>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {filteredProducts.map((product) => (
                          <SortableRow key={product.id} id={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-10 w-10 rounded-md object-cover" src={product.images?.[0] || 'placeholder.jpg'} alt={product.name} />
                                </div>
                                <div className="mr-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {(() => {
                                const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
                                const activeDiscount = getActiveDiscount(product);
                                const discountedPrice = activeDiscount ? calculateDiscountedPrice(price, activeDiscount) : null;
                                
                                return (
                                  <div className="flex items-center gap-2">
                                    {discountedPrice ? (
                                      <>
                                        <span className="text-red-600 font-medium">
                                          {discountedPrice.toFixed(2)} ج.م
                                        </span>
                                        <span className="line-through text-gray-400">
                                          {price.toFixed(2)} ج.م
                                        </span>
                                        <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                                          -{activeDiscount}%
                                        </span>
                                      </>
                                    ) : (
                                      <span>{price.toFixed(2)} ج.م</span>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {(categories.find(cat => cat.id === product.categoryId)?.name) || 'غير محدد'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.inStock ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">
                                  متوفر
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                                  غير متوفر
                                </span>
                              )}
                              {product.featured && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-light text-secondary-dark ml-2 dark:bg-secondary-dark dark:text-secondary-light">
                                  مميز
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="text-primary-light text-primary-lightrimary-lightext-primary-lighttext-primary-light dark:hover:text-secondary"
                                >
                                  تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(product)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500 ml-2"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </SortableRow>
                        ))}
                      </tbody>
                    </SortableContext>
                  </DndContext>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh] dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>
            <form onSubmit={handleModalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">اسم المنتج</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">الوصف</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">السعر (ج.م)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    placeholder="0"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    اتركه فارغًا أو 0 لإلغاء الخصم
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">تاريخ انتهاء الخصم</label>
                  <input
                    type="date"
                    name="discountEndDate"
                    value={formData.discountEndDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    تاريخ انتهاء صلاحية الخصم
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">الفئة</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  >
                    <option value="">اختر فئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">الماركة</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الماركة"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    id="featured"
                    className="h-4 w-4 text-primary-light rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-light dark:checked:border-primary-light"
                  />
                  <label htmlFor="featured" className="mr-2 block text-sm text-gray-900 dark:text-gray-200">منتج مميز</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    id="inStock"
                    className="h-4 w-4 text-primary-light rounded dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-primary-light dark:checked:border-primary-light"
                  />
                  <label htmlFor="inStock" className="mr-2 block text-sm text-gray-900 dark:text-gray-200">متوفر في المخزون</label>
                </div>
              </div>

              {/* Variations and Images */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">صور المنتج</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUrlInput(false)}
                      className={`px-4 py-2 text-sm rounded-md ${!isUrlInput ? 'bg-primary text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'} transition-colors dark:hover:bg-gray-600`}
                    >
                      رفع ملف
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUrlInput(true)}
                      className={`px-4 py-2 text-sm rounded-md ${isUrlInput ? 'bg-primary text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'} transition-colors dark:hover:bg-gray-600`}
                    >
                      إضافة رابط صورة
                    </button>
                  </div>

                  {isUrlInput ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={handleUrlInputChange}
                        placeholder="أضف رابط الصورة"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddToArray('images')}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        disabled={uploadingImages}
                      >
                        إضافة
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {imageInput ? imageInput.name : (
                          <span className="flex items-center">
                            <Upload size={18} className="ml-2" /> اختيار ملف
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddToArray('images')}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        disabled={!imageInput || uploadingImages}
                      >
                        {uploadingImages ? 'جاري الرفع...' : 'إضافة'}
                      </button>
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Product Image ${index + 1}`} className="h-16 w-16 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleRemoveFromArray('images', image)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
                          style={{ transform: 'translate(25%, -25%)' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  رابط الفيديو (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  name="video"
                  id="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  يمكنك إضافة رابط فيديو من YouTube أو Vimeo
                </p>
              </div>

              {/* Form Actions */}
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
                  disabled={loading || uploadingImages}
                >
                  {selectedProduct ? 'حفظ التغييرات' : 'إضافة المنتج'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={loading || uploadingImages}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl dark:bg-gray-800">
            <div className="text-center mb-4">
              <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">تأكيد الحذف</h3>
              <p className="text-gray-600 text-sm dark:text-gray-300">
                هل أنت متأكد أنك تريد حذف المنتج "{selectedProduct.name}"؟
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-600"
                disabled={loading}
              >
                حذف
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                disabled={loading}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductsPage;