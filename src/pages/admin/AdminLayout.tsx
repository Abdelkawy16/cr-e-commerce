import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tag, ShoppingBag, LogOut, Menu, X, MapPin, Package, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = [
    {
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      label: 'لوحة التحكم',
      exact: true,
    },
    {
      path: '/admin/orders',
      icon: <Package size={20} />,
      label: 'الطلبات',
    },
    {
      path: '/admin/categories',
      icon: <Tag size={20} />,
      label: 'إدارة الأقسام',
    },
    {
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
      label: 'إدارة الأزياء',
    },
    {
      path: '/admin/pickup-location',
      icon: <MapPin size={20} />,
      label: 'موقع الاستلام',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                className="md:hidden p-2 text-white dark:text-gray-200"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="text-xl font-bold text-white dark:text-gray-100">فِطرة </Link>
              <span className="hidden md:inline-block text-sm bg-white/20 px-2 py-1 rounded text-white dark:text-gray-300">لوحة التحكم</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-white" />
                ) : (
                  <Sun className="h-5 w-5 text-white" />
                )}
              </button>
              <Link to="/" className="text-sm hover:underline text-white dark:text-gray-200">
                العودة للموقع
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 hover:underline text-white dark:text-gray-200"
              >
                <LogOut size={18} />
                <span className="hidden md:inline-block">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg dark:bg-gray-800">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-md dark:hover:bg-gray-700"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${isActive(item.path) ? 'bg-primary-light text-white dark:bg-primary-dark' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="mr-3">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-white shadow-md py-4 dark:bg-gray-800">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${isActive(item.path) ? 'bg-primary-light text-white dark:bg-primary-dark ' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                {item.icon}
                <span className="mr-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 py-6 px-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;