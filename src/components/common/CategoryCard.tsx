import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
          },
        }
      );
      // GSAP hover effect
      const el = cardRef.current;
      const onEnter = () => {
        gsap.to(el, { scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', duration: 0.3, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(el, { scale: 1, boxShadow: '0 1px 4px 0 rgba(31,38,135,0.08)', duration: 0.3, ease: 'power2.inOut' });
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    }
  }, []);

  return (
    <motion.div 
      ref={cardRef}
      className="card relative overflow-hidden rounded-lg h-64 bg-white dark:bg-gray-800 transition-colors duration-300"
    >
      <Link to={`/category/${category.id}`}>
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700">
          <img 
            src={category.image || 'https://www.elegantthemes.com/blog/wp-content/uploads/2017/08/featuredimage-10.jpg'} 
            alt={category.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white dark:text-gray-100 transition-colors duration-300">
          <h3 className="text-xl font-bold">{category.name}</h3>
          {category.description && (
            <p className="mt-1 text-sm text-gray-200 dark:text-gray-300 transition-colors duration-300 line-clamp-2">{category.description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;