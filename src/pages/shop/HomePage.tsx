import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../../components/layout/Layout';
import FeaturedProducts from '../../components/shop/FeaturedProducts';
import CategoriesShowcase from '../../components/shop/CategoriesShowcase';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

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
        {/* Hero Section with Modern Electronics Design */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          {/* Background image slider */}
          {images.map((image, index) => (
            <motion.div 
              key={image}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${image})`,
                filter: 'brightness(0.6) contrast(1.1)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImage === index ? 1 : 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          ))}
          
          {/* Decorative elements with enhanced animations */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 120, 0],
              y: [0, 60, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ zIndex: 1 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -120, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ zIndex: 1 }}
          />
          {/* Floating animated decorative element */}
          <motion.div
            ref={floatingRef}
            className="absolute left-1/2 top-1/3 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 flex justify-center">
            <motion.div
              className="max-w-4xl text-white text-center"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                ref={heroTitleRef}
                className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                TechTrend Innovations
              </motion.h1>
              <motion.p
                ref={heroSubtitleRef}
                className="text-xl md:text-3xl mb-10 leading-relaxed max-w-3xl mx-auto"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                Discover cutting-edge electronics and gadgets for a smarter lifestyle
              </motion.p>
              <motion.div
                ref={heroButtonsRef}
                className="flex justify-center gap-6"
                style={{ opacity: 0 }}
                variants={heroItem}
              >
                <Link to="/products">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Shop Now
                  </button>
                </Link>
                <Link to="/categories">
                  <button
                    className="bg-white/20 hover:bg-white/30 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30"
                  >
                    Explore Categories
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
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-12 border-2 border-blue-300 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-2.5 bg-blue-300 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Products with Modern Card Design */}
        <section className="py-24 relative bg-gray-50 dark:bg-gray-800" ref={featuredSectionRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 gsap-fadein">
              <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                Trending Gadgets
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <FeaturedProducts />
          </div>
        </section>

        {/* Categories with Enhanced Design */}
        <section className="py-24 bg-white dark:bg-gray-900" ref={categoriesSectionRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 gsap-fadein">
              <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                Shop by Category
              </h2>
              <div className="w-40 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <CategoriesShowcase />
          </div>
        </section>
        
        {/* Why Choose Us Section with Enhanced Design */}
        <section
          className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 relative overflow-hidden transition-colors duration-300"
          ref={whyChooseUsSectionRef}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
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
              <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                Why Choose TechTrend?
              </h2>
              <motion.div 
                className="w-40 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 160 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: "M5 13l4 4L19 7",
                  title: "Cutting-Edge Technology",
                  description: "Explore the latest innovations in electronics with top-tier performance and reliability",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100",
                  darkBgColor: "from-blue-900/20 to-blue-800/20"
                },
                {
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
                  title: "Best Value Deals",
                  description: "Get premium electronics at competitive prices with exclusive offers and discounts",
                  color: "from-green-500 to-green-600",
                  bgColor: "from-green-50 to-green-100",
                  darkBgColor: "from-green-900/20 to-green-800/20"
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Secure Shopping",
                  description: "Shop confidently with secure payments, fast shipping, and hassle-free returns",
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
                      className="absolute top-4 right-4 w-2 h-2 bg-blue-500/30 rounded-full"
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
                      className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-500/40 rounded-full"
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
                        className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300"
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
                className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Your Tech, Our Passion - 24/7 Support</span>
                <motion.div
                  className="w-3 h-3 bg-cyan-500 rounded-full"
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