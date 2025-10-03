import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import RequireAuth from './components/admin/RequireAuth';
import { AnimatePresence, motion } from 'framer-motion';

// Shop Pages
import HomePage from './pages/shop/HomePage';
import ProductsPage from './pages/shop/ProductsPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CategoriesPage from './pages/shop/CategoriesPage';
import CategoryDetailPage from './pages/shop/CategoryDetailPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import FavoritesPage from './pages/shop/FavoritesPage';

// Auth Pages
import LoginPage from './pages/admin/LoginPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import PickupLocationPage from './pages/admin/PickupLocationPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AnimatePresence mode="wait">
              <Routes>
                {[
                  <Route key="/" path="/" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><HomePage /></motion.div>} />,
                  <Route key="/products" path="/products" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><ProductsPage /></motion.div>} />,
                  <Route key="/product/:id" path="/product/:id" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><ProductDetailPage /></motion.div>} />,
                  <Route key="/categories" path="/categories" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><CategoriesPage /></motion.div>} />,
                  <Route key="/category/:id" path="/category/:id" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><CategoryDetailPage /></motion.div>} />,
                  <Route key="/cart" path="/cart" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><CartPage /></motion.div>} />,
                  <Route key="/checkout" path="/checkout" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><CheckoutPage /></motion.div>} />,
                  <Route key="/favorites" path="/favorites" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><FavoritesPage /></motion.div>} />,
                  <Route key="/login" path="/login" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><LoginPage /></motion.div>} />,
                  <Route key="/admin" path="/admin" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><RequireAuth requireAdmin={true}><DashboardPage /></RequireAuth></motion.div>} />,
                  <Route key="/admin/orders" path="/admin/orders" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><RequireAuth requireAdmin={true}><OrdersPage /></RequireAuth></motion.div>} />,
                  <Route key="/admin/categories" path="/admin/categories" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><RequireAuth requireAdmin={true}><AdminCategoriesPage /></RequireAuth></motion.div>} />,
                  <Route key="/admin/products" path="/admin/products" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><RequireAuth requireAdmin={true}><AdminProductsPage /></RequireAuth></motion.div>} />,
                  <Route key="/admin/pickup-location" path="/admin/pickup-location" element={<motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-30}} transition={{duration:0.5}}><RequireAuth requireAdmin={true}><PickupLocationPage /></RequireAuth></motion.div>} />,
                  <Route key="*" path="*" element={<Navigate to="/" replace />} />
                ]}
              </Routes>
            </AnimatePresence>
          </Router>
          
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
              },
            }}
          />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;