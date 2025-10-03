import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Sun, Moon, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import CartSidebar from '../shop/CartSidebar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );

  const { cartItems, openSidebar, isSidebarOpen, closeSidebar } = useCart();
  const { currentUser, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const logoRef = useRef<HTMLHeadingElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    gsap.fromTo(logoRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    if (navLinksRef.current) {
      gsap.fromTo(
        navLinksRef.current.children,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  return (
    <>
      <header className="glass-effect sticky top-0 z-50 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <h1 ref={logoRef} className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform">
                فِـــــــــطــــــــــــرة
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav ref={navLinksRef} className="hidden md:flex items-center space-x-6 space-x-reverse">
              <Link to="/" className="nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors">
                الرئيسية
              </Link>
              <Link to="/categories" className="nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors">
                الأنواع
              </Link>
              <Link to="/products" className="nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors">
                المنتجات
              </Link>
              {currentUser?.isAdmin && (
                <Link to="/admin" className="nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors">
                  لوحة التحكم
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Sun className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                )}
              </button>

              <Link
                to="/favorites"
                className="relative p-2 text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
              >
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <button 
                onClick={openSidebar}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {currentUser ? (
                <div className="hidden md:flex items-center space-x-4 space-x-reverse text-gray-700 dark:text-gray-200">
                  <span className="text-gray-700 dark:text-gray-200">
                    <User className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                  >
                    <LogOut className="h-5 w-5 ml-1" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                null
              )}

              <button 
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" 
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav 
              className="md:hidden mt-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                to="/" 
                className="mobile-nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                onClick={toggleMenu}
              >
                الرئيسية
              </Link>
              <Link 
                to="/categories" 
                className="mobile-nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                onClick={toggleMenu}
              >
                الأنواع
              </Link>
              <Link 
                to="/products" 
                className="mobile-nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                onClick={toggleMenu}
              >
                المنتجات
              </Link>
              {currentUser?.isAdmin && (
                <Link 
                  to="/admin" 
                  className="mobile-nav-link text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                  onClick={toggleMenu}
                >
                  لوحة التحكم
                </Link>
              )}
              {currentUser ? (
                <>
                  <div className="mobile-nav-link text-gray-700 dark:text-gray-200 flex items-center">
                    <User className="h-6 w-6 ml-2" />
                    <span>حسابي</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="mobile-nav-link w-full text-right text-gray-700 dark:text-gray-200 hover:text-primary-light dark:hover:text-secondary transition-colors"
                  >
                    <LogOut className="inline-block h-5 w-5 ml-1" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                null
              )}
            </motion.nav>
          )}
        </div>
      </header>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Header;