import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../../components/layout/Layout';
import FeaturedProducts from '../../components/shop/FeaturedProducts';
import CategoriesShowcase from '../../components/shop/CategoriesShowcase';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const heroVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};

const HomePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const allImages = [
    '/images/bg.jpg',
    '/images/bg1.jpg',
    '/images/bg2.jpg'
  ];

  const images = isMobile 
    ? allImages.filter(img => img === '/images/bg.jpg' || img === '/images/bg2.jpg')
    : allImages;

  // GSAP refs
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const categoriesSectionRef = useRef<HTMLDivElement>(null);
  const whyChooseUsSectionRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // GSAP entrance animation for hero section
    gsap.fromTo(
      heroTitleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(
      heroSubtitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo(
      heroButtonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.0 }
    );

    // GSAP scroll animations for sections
    if (featuredSectionRef.current) {
      gsap.fromTo(
        featuredSectionRef.current.querySelectorAll('.gsap-fadein'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredSectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }
    if (categoriesSectionRef.current) {
      gsap.fromTo(
        categoriesSectionRef.current.querySelectorAll('.gsap-fadein'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: categoriesSectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }
    if (whyChooseUsSectionRef.current) {
      gsap.fromTo(
        whyChooseUsSectionRef.current.querySelectorAll('.gsap-fadein'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: whyChooseUsSectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    // GSAP floating parallax for decorative element
    if (floatingRef.current) {
      gsap.to(floatingRef.current, {
        y: 40,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section with Modern Design */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
          {/* Background image slider */}
          {images.map((image, index) => (
            <motion.div 
              key={image}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${image})`,
                filter: 'brightness(0.5)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImage === index ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
          
          {/* Decorative elements with enhanced animations */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ zIndex: 1 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-light/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ zIndex: 1 }}
          />
          {/* Floating animated decorative element */}
          <motion.div
            ref={floatingRef}
            className="absolute left-1/2 top-1/3 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex justify-end">
            <motion.div
              className="max-w-3xl text-white text-right"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                ref={heroTitleRef}
                className="text-7xl font-bold mb-6 font-arabic leading-tight"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                أزياء إسلامية بلمسة عصرية
              </motion.h1>
              <motion.p
                ref={heroSubtitleRef}
                className="text-2xl mb-8 leading-relaxed max-w-2xl ml-auto"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                تشكيلة مميزة من الملابس المحتشمة للنساء بأحدث التصاميم والألوان
              </motion.p>
              <motion.div
                ref={heroButtonsRef}
                className="flex justify-end gap-4"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                <Link to="/products">
                  <button
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-lg"
                  >
                    تسوق الآن
                  </button>
                </Link>
                <Link to="/categories">
                  <button
                    className="bg-white/30 hover:bg-white/40 text-white px-10 py-4 rounded-full text-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                  >
                    اكتشف الأقسام
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            style={{ opacity, scale }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Products with Modern Card Design */}
        <section className="py-24 relative" ref={featuredSectionRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 gsap-fadein">
              <h2 className="text-4xl font-bold text-primary-light mb-6 font-arabic">
                أحدث الأزياء
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-secondary to-secondary-light mx-auto rounded-full"></div>
            </div>
            <FeaturedProducts />
          </div>
        </section>

        {/* Categories with Enhanced Design */}
        <section className="py-24" ref={categoriesSectionRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 gsap-fadein">
              <h2 className="text-4xl font-bold text-primary-light mb-6 font-arabic">
                تصفح حسب القسم
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-secondary to-secondary-light mx-auto rounded-full"></div>
            </div>
            <CategoriesShowcase />
          </div>
        </section>
        
        {/* Why Choose Us Section with Enhanced Design */}
        <section
          className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"
          ref={whyChooseUsSectionRef}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-primary-light mb-6 font-arabic dark:text-primary-light transition-colors duration-300">
                لماذا تختار فِطرة؟
              </h2>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-secondary to-secondary-light mx-auto rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 128 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: "M5 13l4 4L19 7",
                  title: "جودة عالية",
                  description: "نختار بعناية خاماتنا لتكون الأفضل جودة وأكثر راحة في الاستخدام",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100",
                  darkBgColor: "from-blue-900/20 to-blue-800/20"
                },
                {
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "توصيل سريع",
                  description: "نوصل طلبك بسرعة وأمان لحد باب البيت في كل أنحاء مصر",
                  color: "from-green-500 to-green-600",
                  bgColor: "from-green-50 to-green-100",
                  darkBgColor: "from-green-900/20 to-green-800/20"
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "تسوق آمن",
                  description: "تسوق بثقة مع خيارات دفع متعددة وآمنة وسياسة إرجاع مرنة",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100",
                  darkBgColor: "from-purple-900/20 to-purple-800/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                >
                  {/* Card with enhanced styling */}
                  <div className="relative p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 dark:from-gray-800 dark:to-gray-700 dark:shadow-gray-700 dark:hover:shadow-gray-600 border border-gray-100 dark:border-gray-600 overflow-hidden">
                    
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} dark:${feature.darkBgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    
                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full"
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                    <motion.div
                      className="absolute bottom-4 left-4 w-1 h-1 bg-secondary/40 rounded-full"
                      animate={{
                        y: [0, 8, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    />
                    
                    {/* Icon container with enhanced animations */}
                    <motion.div
                      className={`relative mx-auto w-28 h-28 rounded-2xl flex items-center justify-center mb-8 shadow-lg bg-gradient-to-br ${feature.color} group-hover:shadow-2xl transition-all duration-500`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                      />
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-14 w-14 text-white relative z-10" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </motion.div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <motion.h3 
                        className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300 font-arabic"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600 leading-relaxed dark:text-gray-300 transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                    
                    {/* Bottom accent line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-3xl`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom decorative element */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-primary font-semibold">نحن هنا لخدمتك على مدار الساعة</span>
                <motion.div
                  className="w-3 h-3 bg-secondary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default HomePage;