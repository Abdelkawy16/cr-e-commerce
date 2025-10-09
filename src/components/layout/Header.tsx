import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Sun, Moon, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
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
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative">
              <motion.h1 
                ref={logoRef} 
                className="text-2xl font-serif font-bold tracking-wider text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Fitrah
              </motion.h1>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Desktop Navigation */}
            <nav ref={navLinksRef} className="hidden md:flex items-center space-x-8">
              {[
                { to: '/', label: 'Home' },
                { to: '/categories', label: 'Categories' },
                { to: '/products', label: '{Products}' },
                ...(currentUser?.isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : [])
              ].map((item) => (
                <Link 
                  key={item.to}
                  to={item.to}
                  className="relative px-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.button 
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400" />
                )}
              </motion.button>

              <motion.div 
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/favorites"
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                    >
                      {favorites.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              <motion.div
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <button 
                  onClick={openSidebar}
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 500, 
                        damping: 10 
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </button>
              </motion.div>

              {currentUser && (
                <motion.div 
                  className="hidden md:block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </button>
                </motion.div>
              )}

              <motion.button 
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300" 
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav 
                className="md:hidden mt-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="space-y-1">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/categories', label: 'Categories' },
                    { to: '/products', label: 'Products' },
                    ...(currentUser?.isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : []),
                    ...(currentUser ? [
                      { 
                        to: '/account', 
                        label: 'My Account',
                        icon: <User className="h-5 w-5 mr-2" />
                      },
                      { 
                        to: '#', 
                        label: 'Sign Out',
                        icon: <LogOut className="h-5 w-5 mr-2" />,
                        onClick: () => {
                          handleLogout();
                          toggleMenu();
                        }
                      }
                    ] : [])
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.to === '#' ? (
                        <button
                          onClick={item.onClick}
                          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.to}
                          onClick={toggleMenu}
                          className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default Header;