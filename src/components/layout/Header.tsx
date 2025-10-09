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
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    // Apply theme on initial load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // GSAP animations for logo and nav links
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' }
    );
    if (navLinksRef.current) {
      gsap.fromTo(
        navLinksRef.current.children,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out', delay: 0.3 }
      );
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-blue-800/50 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative">
              <motion.h1 
                ref={logoRef} 
                className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors duration-300"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                TechTrend
              </motion.h1>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav ref={navLinksRef} className="hidden md:flex items-center space-x-10">
              {[
                { to: '/', label: 'Home' },
                { to: '/categories', label: 'Categories' },
                { to: '/products', label: 'Products' },
                ...(currentUser?.isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : [])
              ].map((item) => (
                <Link 
                  key={item.to}
                  to={item.to}
                  className="relative px-2 py-2 text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300 group"
                >
                  {item.label}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                  />
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              {/* Theme Toggle */}
              <motion.button 
                onClick={toggleTheme}
                className="p-2 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-full transition-all duration-300"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: theme === 'dark' ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {theme === 'light' ? (
                    <Moon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  ) : (
                    <Sun className="h-6 w-6 text-amber-400" />
                  )}
                </motion.div>
              </motion.button>

              <motion.div 
                className="relative"
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/favorites"
                  className="relative p-2 text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                  {favorites.length > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                    >
                      {favorites.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              <motion.div
                className="relative"
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <button 
                  onClick={openSidebar}
                  className="relative p-2 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-full transition-all duration-300"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 600, 
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
                  className="hidden md:flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-6 w-6 mr-2" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </button>
                </motion.div>
              )}

              <motion.button 
                className="md:hidden p-2 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-full transition-all duration-300" 
                onClick={toggleMenu}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-7 w-7 text-blue-600 dark:text-blue-300" />
                ) : (
                  <Menu className="h-7 w-7 text-blue-600 dark:text-blue-300" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav 
                className="md:hidden mt-4 pt-4 pb-6 bg-white/95 dark:bg-gray-900/95 border-t border-blue-200/50 dark:border-blue-800/50 rounded-b-xl"
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <div className="space-y-2 px-4">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/categories', label: 'Categories' },
                    { to: '/products', label: 'Products' },
                    ...(currentUser?.isAdmin ? [{ to: '/admin', label: 'Dashboard' }] : []),
                    ...(currentUser ? [
                      { 
                        to: '/account', 
                        label: 'My Account',
                        icon: <User className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-300" />
                      },
                      { 
                        to: '#', 
                        label: 'Sign Out',
                        icon: <LogOut className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-300" />,
                        onClick: () => {
                          handleLogout();
                          toggleMenu();
                        }
                      }
                    ] : [])
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                    >
                      {item.to === '#' ? (
                        <button
                          onClick={item.onClick}
                          className="w-full flex items-center px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-lg transition-colors duration-300"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.to}
                          onClick={toggleMenu}
                          className="w-full flex items-center px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-lg transition-colors duration-300"
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