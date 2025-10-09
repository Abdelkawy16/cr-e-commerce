import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, Facebook, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-blue-800/50 transition-all duration-500">
      <div className="container mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Decorative Elements */}
          <motion.div
            className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 40, 0],
              y: [0, 20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-300">TechTrend</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              Your premier destination for cutting-edge electronics and gadgets. Explore innovative technology with top-tier performance and style.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Facebook size={24} />
                </motion.div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Instagram size={24} />
                </motion.div>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/categories', label: 'Categories' },
                { to: '/products', label: 'Products' },
                { to: '/cart', label: 'Cart' }
              ].map((item) => (
                <motion.li
                  key={item.to}
                  whileHover={{ x: 5, color: '#22d3ee' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={item.to}
                    className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-300">Contact</h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <Phone size={22} className="ml-3 text-blue-600 dark:text-blue-300" />
                <span>+385 1 2345 678</span>
              </li>
              <li className="flex items-center">
                <Mail size={22} className="ml-3 text-blue-600 dark:text-blue-300" />
                <span>support@techtrend.com</span>
              </li>
              <li className="flex items-center">
                <MapPin size={22} className="ml-3 text-blue-600 dark:text-blue-300" />
                <span>Zagreb, Croatia</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-200/50 dark:border-blue-800/50 pt-8 mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} TechTrend. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;