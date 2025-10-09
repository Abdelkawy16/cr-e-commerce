import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-100">Fitrah</h3>
            <p className="mb-4 text-white/80 dark:text-gray-300">
              A specialized store in Islamic fashion for women. We offer a wide range of high-quality modest clothing with the latest designs and colors.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://www.facebook.com/profile.php?id=61576759931560" target="_blank" className="hover:text-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/fetra_98" target="_blank" className="hover:text-secondary transition-colors">
                <Instagram size={20} />
              </a>
              {/* <a href="#" className="hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors text-white/80 dark:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors text-white/80 dark:text-gray-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-secondary transition-colors text-white/80 dark:text-gray-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-secondary transition-colors text-white/80 dark:text-gray-300">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-secondary transition-colors text-white/80 dark:text-gray-300">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-100">Contact</h3>
            <ul className="space-y-2 text-white/80 dark:text-gray-300">
              {/* <li className="flex items-center">
                <Phone size={20} className="ml-2" />
                <span>01024280200</span>
              </li> */}
              <li className="flex items-center">
                <Mail size={20} className="ml-2" />
                <span>info@fitra-online.com</span>
              </li>
              <li className="flex items-center">
                <MapPin size={20} className="ml-2" />
                <span>Zagreb , Croatia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-8 text-center text-sm text-white/60 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Fitrah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;