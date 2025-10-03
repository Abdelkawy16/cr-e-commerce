import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const FAQS = [
  { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل الدفع عند الاستلام، والدفع عبر المحافظ الإلكترونية.' },
  { question: 'كم يستغرق توصيل الطلب؟', answer: 'عادةً من 2 إلى 5 أيام عمل داخل مصر.' },
  { question: 'هل يمكنني استبدال أو إرجاع المنتج؟', answer: 'نعم، يمكنك الاستبدال أو الإرجاع خلال 14 يومًا من الاستلام.' },
  { question: 'كيف أتتبع طلبي؟', answer: 'سوف تتلقى رسالة نصية عند شحن الطلب مع تفاصيل التتبع.' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {/* Floating Chqtbot Button */}
      <motion.button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        aria-label="افتح شات بوت الأسئلة"
      >
        <MessageCircle className="w-6 h-6" />
        <motion.div
          className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          اسأل شات بوت فِطرة
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </motion.div>
      </motion.button>
      {/* Chqtbot Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setIsChatOpen(false)}
                aria-label="إغلاق الشات بوت"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-4 text-primary">شات بوت فِطرة</h3>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx}>
                    <button
                      className="w-full text-right text-gray-800 dark:text-gray-100 font-medium py-2 px-3 rounded hover:bg-primary/10 transition-colors"
                      onClick={() => setSelectedQuestion(idx)}
                    >
                      {faq.question}
                    </button>
                    {selectedQuestion === idx && (
                      <motion.div
                        className="mt-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded p-3 text-gray-900 dark:text-gray-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">هذا الشات بوت يجيب على الأسئلة الشائعة فقط.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;