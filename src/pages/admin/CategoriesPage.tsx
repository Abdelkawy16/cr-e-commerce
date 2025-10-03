import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  categoryHasProducts,
  categoryHasSubcategories,
  getSubcategories
} from '../../firebase/categories';
import { Category } from '../../types';

interface CategoryWithSubcategories extends Category {
  subcategories?: CategoryWithSubcategories[];
  isExpanded?: boolean;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    parentId: '',
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getCategories();
      
      // Organize categories into a hierarchy
      const mainCategories = categoriesData.filter(cat => !cat.parentId);
      const categoriesWithSubs = await Promise.all(
        mainCategories.map(async (cat) => {
          const subcategories = await getSubcategories(cat.id);
          return {
            ...cat,
            subcategories,
            isExpanded: false
          };
        })
      );
      
      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء تحميل الفئات');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle subcategories expansion
  const toggleSubcategories = async (categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          isExpanded: !cat.isExpanded
        };
      }
      return cat;
    }));
  };

  // Open modal for adding a new category
  const handleAddClick = (parentId?: string) => {
    // Check if the parent category is already a subcategory
    const parentCategory = categories.find(cat => cat.id === parentId);
    if (parentId && parentCategory?.parentId) {
      toast.error('لا يمكن إضافة فئات فرعية للفئات الفرعية');
      return;
    }

    setSelectedCategory(null);
    setFormData({ 
      name: '', 
      description: '', 
      imageUrl: '',
      parentId: parentId || ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a category
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ 
      name: category.name,
      description: category.description,
      imageUrl: category.image || '',
      parentId: category.parentId || ''
    });
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedCategory) {
        // Update existing category
        await updateCategory(
          selectedCategory.id,
          {
            name: formData.name,
            description: formData.description,
          },
          formData.imageUrl,
          formData.parentId || undefined
        );
        toast.success('تم تحديث الفئة بنجاح');
      } else {
        // Add new category
        await addCategory(
          {
            name: formData.name,
            description: formData.description,
          },
          formData.imageUrl,
          formData.parentId || undefined
        );
        toast.success('تم إضافة الفئة بنجاح');
      }
      // Refresh categories list
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`حدث خطأ أثناء حفظ الفئة: ${error instanceof Error ? error.message : ''}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      // Check if category has products or subcategories
      const [hasProducts, hasSubcategories] = await Promise.all([
        categoryHasProducts(selectedCategory.id),
        categoryHasSubcategories(selectedCategory.id)
      ]);
      
      if (hasProducts) {
        toast.error('لا يمكن حذف الفئة لأنها تحتوي على منتجات');
      } else if (hasSubcategories) {
        toast.error('لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية');
      } else {
        await deleteCategory(selectedCategory.id);
        toast.success('تم حذف الفئة بنجاح');
        fetchCategories();
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(`حدث خطأ أثناء حذف الفئة: ${error instanceof Error ? error.message : ''}`);
    }
  };

  const renderCategoryRow = (category: CategoryWithSubcategories, level: number = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isSubcategory = !!category.parentId;
    
    return (
      <React.Fragment key={category.id}>
        <tr className="bg-white dark:bg-gray-800">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ marginRight: `${level * 2}rem` }}>
              {hasSubcategories && (
                <button
                  onClick={() => toggleSubcategories(category.id)}
                  className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {category.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
              )}
              {category.image ? (
                <div className="h-10 w-10 flex-shrink-0">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                  <Tag className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                </div>
              )}
              <div className="mr-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs overflow-hidden text-ellipsis">
            {category.description}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {category.image ? (
              <a 
                href={category.image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-light hover:text-primary-light-dark dark:text-primary-light dark:hover:text-secondary"
              >
                عرض الصورة
              </a>
            ) : (
              'لا توجد صورة'
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex gap-2">
              {!isSubcategory && (
                <button
                  onClick={() => handleAddClick(category.id)}
                  className="text-primary-light hover:text-primary-light-dark dark:text-primary-light dark:hover:text-secondary"
                >
                  إضافة فئة فرعية
                </button>
              )}
              <button
                onClick={() => handleEditClick(category)}
                className="text-primary-light hover:text-primary-light-dark dark:text-primary-light dark:hover:text-secondary"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDeleteClick(category)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500 ml-2"
              >
                حذف
              </button>
            </div>
          </td>
        </tr>
        {category.isExpanded && category.subcategories?.map(subcategory => 
          renderCategoryRow(subcategory, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">إدارة الفئات</h1>
        <button
          onClick={() => handleAddClick()}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
        >
          <Plus size={20} className="ml-2" />
          إضافة فئة جديدة
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 dark:shadow-gray-700">
          {categories.length === 0 ? (
            <p className="text-gray-600 text-center p-6 dark:text-gray-300">لا توجد فئات حاليًا.</p>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile View */}
              <div className="md:hidden space-y-4 p-4">
                {categories.map(category => (
                  <React.Fragment key={category.id}>
                    <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                      <div className="flex items-center mb-3">
                        {category.image ? (
                          <div className="h-12 w-12 flex-shrink-0">
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                            <Tag className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                          </div>
                        )}
                        <div className="mr-3 flex-1">
                          <div className="flex items-center">
                            {category.subcategories && category.subcategories.length > 0 && (
                              <button
                                onClick={() => toggleSubcategories(category.id)}
                                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                {category.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </button>
                            )}
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400 line-clamp-2">
                            {category.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => handleAddClick(category.id)}
                          className="flex-1 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
                        >
                          إضافة فئة فرعية
                        </button>
                        <button
                          onClick={() => handleEditClick(category)}
                          className="flex-1 px-3 py-1.5 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="flex-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                    
                    {/* Subcategories */}
                    {category.isExpanded && category.subcategories && category.subcategories.length > 0 && (
                      <div className="mr-4 space-y-4">
                        {category.subcategories.map(subcategory => (
                          <div key={subcategory.id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                            <div className="flex items-center mb-3">
                              {subcategory.image ? (
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img 
                                    src={subcategory.image} 
                                    alt={subcategory.name} 
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                                  <Tag className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                                </div>
                              )}
                              <div className="mr-3 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{subcategory.name}</div>
                                <div className="text-xs text-gray-500 mt-1 dark:text-gray-400 line-clamp-2">
                                  {subcategory.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {!subcategory.parentId && (
                                <button
                                  onClick={() => handleAddClick(subcategory.id)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
                                >
                                  إضافة فئة فرعية
                                </button>
                              )}
                              <button
                                onClick={() => handleEditClick(subcategory)}
                                className="flex-1 px-3 py-1.5 text-xs bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteClick(subcategory)}
                                className="flex-1 px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Desktop View */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      الفئة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      الوصف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      الصورة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {categories.map(category => renderCategoryRow(category))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {selectedCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            </h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">اسم الفئة</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">الفئة الأب (اختياري)</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                >
                  <option value="">بدون فئة أب</option>
                  {categories
                    .filter(category => !category.parentId) // Only show main categories as parent options
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">رابط الصورة (اختياري)</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
                  disabled={loading}
                >
                  {selectedCategory ? 'حفظ التغييرات' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={loading}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 ml-2" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">تأكيد الحذف</h2>
            </div>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              هل أنت متأكد من حذف الفئة "{selectedCategory?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

export default CategoriesPage;