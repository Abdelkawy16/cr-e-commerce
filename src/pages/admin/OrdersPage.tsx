import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Trash2, AlertCircle, Package, Eye, Phone, Truck, CheckSquare, BarChart2, TrendingUp, Users, ShoppingBag, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { getOrders, updateOrderStatus, deleteOrder } from '../../firebase/orders';
import { Order } from '../../types';
import { getCategoryById } from '../../firebase/categories';
import { calculateDeliveryCost } from '../../utils/delivery';
import { formatPhoneNumber, validateEgyptianPhone, getPhoneErrorMessage } from '../../utils/validation';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>({});
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  // Fetch category names when an order is selected
  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (selectedOrder) {
        const uniqueCategoryIds = [...new Set(selectedOrder.items.map(item => item.categoryId))];
        const names: { [key: string]: string } = {};
        
        for (const categoryId of uniqueCategoryIds) {
          try {
            const category = await getCategoryById(categoryId);
            if (category) {
              names[categoryId] = category.name;
            }
          } catch (error) {
            console.error('Error fetching category:', error);
          }
        }
        
        setCategoryNames(names);
      }
    };

    fetchCategoryNames();
  }, [selectedOrder]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: 'waiting' | 'confirmed' | 'shipped' | 'received' | 'rejected' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders
      toast.success('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // Handle delete order
  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder.id);
      await fetchOrders(); // Refresh orders
      toast.success('تم حذف الطلب بنجاح');
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('حدث خطأ أثناء حذف الطلب');
    }
  };

  // Handle view details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckSquare className="w-4 h-4 ml-1" />
            تم الاستلام
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Truck className="w-4 h-4 ml-1" />
            تم الشحن
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Phone className="w-4 h-4 ml-1" />
            تم التأكيد
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <XCircle className="w-4 h-4 ml-1" />
            مرفوض
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="w-4 h-4 ml-1" />
            ملغي
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-4 h-4 ml-1" />
            قيد الانتظار
          </span>
        );
    }
  };

  // Get available actions based on current status
  const getAvailableActions = (order: Order) => {
    switch (order.status) {
      case 'waiting':
        return (
          <>
            <button
              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
              title="تأكيد الطلب"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleStatusUpdate(order.id, 'rejected')}
              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
              title="رفض الطلب"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </>
        );
      case 'confirmed':
        return (
          <>
            <button
              onClick={() => handleStatusUpdate(order.id, 'shipped')}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              title="شحن الطلب"
            >
              <Truck className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="إلغاء الطلب"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </>
        );
      case 'shipped':
        return (
          <>
            <button
              onClick={() => handleStatusUpdate(order.id, 'received')}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              title="تأكيد الاستلام"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders
      .filter(order => order.status === 'received')
      .reduce((sum, order) => sum + order.total, 0),
    ordersByStatus: {
      waiting: orders.filter(order => order.status === 'waiting').length,
      confirmed: orders.filter(order => order.status === 'confirmed').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      received: orders.filter(order => order.status === 'received').length,
      rejected: orders.filter(order => order.status === 'rejected').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    },
    recentOrders: orders.slice(0, 3), // Last 3 orders
  };

  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Get status change message
  const getStatusChangeMessage = (order: Order) => {
    const timeAgo = new Date().getTime() - order.lastStatusChange.getTime();
    const minutes = Math.floor(timeAgo / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else {
      return `منذ ${days} يوم`;
    }
  };

  // Format phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove any non-digit characters and add Egypt's country code
    const cleanNumber = phone.replace(/\D/g, '');
    // Remove the leading 0 if it exists
    const numberWithoutZero = cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber;
    // Add Egypt's country code
    return `20${numberWithoutZero}`;
  };

  // Handle select all orders
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedOrders(new Set());
    } else {
      const allOrderIds = new Set(filteredOrders.map(order => order.id));
      setSelectedOrders(allOrderIds);
    }
    setIsSelectAll(!isSelectAll);
  };

  // Handle select single order
  const handleSelectOrder = (orderId: string) => {
    const newSelectedOrders = new Set(selectedOrders);
    if (newSelectedOrders.has(orderId)) {
      newSelectedOrders.delete(orderId);
    } else {
      newSelectedOrders.add(orderId);
    }
    setSelectedOrders(newSelectedOrders);
    setIsSelectAll(newSelectedOrders.size === filteredOrders.length);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus: Order['status']) => {
    try {
      const promises = Array.from(selectedOrders).map(orderId => 
        updateOrderStatus(orderId, newStatus)
      );
      await Promise.all(promises);
      await fetchOrders();
      setSelectedOrders(new Set());
      setIsSelectAll(false);
      toast.success('تم تحديث حالة الطلبات بنجاح');
    } catch (error) {
      console.error('Error updating orders status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلبات');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const promises = Array.from(selectedOrders).map(orderId => 
        deleteOrder(orderId)
      );
      await Promise.all(promises);
      await fetchOrders();
      setSelectedOrders(new Set());
      setIsSelectAll(false);
      toast.success('تم حذف الطلبات بنجاح');
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast.error('حدث خطأ أثناء حذف الطلبات');
    }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">إدارة الطلبات</h1>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full dark:bg-primary-dark/20">
              <ShoppingBag className="w-6 h-6 text-primary dark:text-primary-light" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي المبيعات المكتملة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalRevenue.toFixed(2)} ج.م</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.ordersByStatus.received} طلب مكتمل
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">طلبات قيد الانتظار</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.ordersByStatus.waiting}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">طلبات مكتملة</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.ordersByStatus.received}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">توزيع حالات الطلبات</h3>
          <div className="space-y-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusBadge(status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({((count / stats.totalOrders) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">آخر الطلبات</h3>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.total.toFixed(2)} ج.م</p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="بحث عن طلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
          >
            <option value="all">جميع الحالات</option>
            <option value="waiting">قيد الانتظار</option>
            <option value="confirmed">تم التأكيد</option>
            <option value="shipped">تم الشحن</option>
            <option value="received">تم الاستلام</option>
            <option value="rejected">مرفوض</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedOrders.size} طلب محدد
            </span>
            <div className="flex flex-wrap gap-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value as Order['status'])}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                <option value="">تحديث الحالة</option>
                <option value="waiting">قيد الانتظار</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="shipped">تم الشحن</option>
                <option value="received">تم الاستلام</option>
                <option value="rejected">مرفوض</option>
                <option value="cancelled">ملغي</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-600"
              >
                حذف المحدد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        {/* Mobile View */}
        <div className="md:hidden">
          {filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleViewDetails(order)}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedOrders.has(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {order.id}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="mb-2">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{order.customer.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {formatPhoneNumber(order.customer.phone)}
                      <div className="flex gap-1">
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="اتصال"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(order.customer.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="واتساب"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {order.total.toFixed(2)} ج.م
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {getAvailableActions(order)}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  رقم الطلب
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  العميل
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  الإجمالي
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  الحالة
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  تاريخ الطلب
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  آخر تحديث
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleViewDetails(order)}>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        {formatPhoneNumber(order.customer.phone)}
                        <div className="flex gap-1">
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="اتصال"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${formatPhoneForWhatsApp(order.customer.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="واتساب"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.total.toFixed(2)} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {getStatusChangeMessage(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {getAvailableActions(order)}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl dark:bg-gray-800">
            <div className="text-center mb-4">
              <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">تأكيد الحذف</h3>
              <p className="text-gray-600 text-sm dark:text-gray-300">
                هل أنت متأكد أنك تريد حذف الطلب رقم {selectedOrder.id}؟
              </p>
              {selectedOrder.status === 'received' && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  تحذير: هذا الطلب مكتمل. سيتم حذف جميع بياناته نهائياً.
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-600"
              >
                حذف
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">تفاصيل الطلب</h3>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">معلومات الطلب</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">رقم الطلب:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">الحالة:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">تاريخ الطلب:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDateTime(selectedOrder.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">آخر تحديث للحالة:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getStatusChangeMessage(selectedOrder)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">إجمالي المنتجات:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedOrder.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0).toFixed(2)} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">تكلفة التوصيل:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {(selectedOrder.total - selectedOrder.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)).toFixed(2)} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">الإجمالي الكلي:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedOrder.total.toFixed(2)} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Comment */}
                {selectedOrder.comment && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-2">
                    <span className="block text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">ملاحظات العميل:</span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.comment}</span>
                  </div>
                )}

                {/* Status Update Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">تحديث حالة الطلب</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <label htmlFor="orderStatus" className="text-sm text-gray-600 dark:text-gray-300">
                          حالة الطلب:
                        </label>
                        <select
                          id="orderStatus"
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                        >
                          <option value="waiting">قيد الانتظار</option>
                          <option value="confirmed">تم التأكيد</option>
                          <option value="shipped">تم الشحن</option>
                          <option value="received">تم الاستلام</option>
                          <option value="rejected">مرفوض</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-medium mb-1">تسلسل الحالات:</p>
                        <ol className="list-decimal list-inside space-y-1 mr-4">
                          <li>قيد الانتظار</li>
                          <li>تم التأكيد</li>
                          <li>تم الشحن</li>
                          <li>تم الاستلام</li>
                        </ol>
                        <p className="mt-2 text-orange-600 dark:text-orange-400">
                          يمكنك أيضاً رفض أو إلغاء الطلب في أي وقت
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">معلومات العميل</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">الاسم:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">رقم الهاتف:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPhoneNumber(selectedOrder.customer.phone)}
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${selectedOrder.customer.phone}`}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="اتصال"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                          <a
                            href={`https://wa.me/${formatPhoneForWhatsApp(selectedOrder.customer.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="واتساب"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">العنوان:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customer.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">المنتجات</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</h5>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-2">
                            <span>الفئة: {categoryNames[item.categoryId] || '...'}</span>
                            <span>اللون: {item.selectedColor}</span>
                            <span>المقاس: {item.selectedSize}</span>
                            <span>الكمية: {item.quantity}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                            {Number(item.price).toFixed(2)} ج.م
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersPage; 