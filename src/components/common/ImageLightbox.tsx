import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}) => {
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  if (!isOpen) return null;

  // Animation variants for sliding
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDirection(-1);
                onPrev();
              }}
              className="absolute left-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDirection(1);
                onNext();
              }}
              className="absolute right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Main image */}
        <div className="relative max-w-[90vw] max-h-[90vh] cursor-grab" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) {
                  setDirection(1);
                  onNext();
                } else if (info.offset.x > 100) {
                  setDirection(-1);
                  onPrev();
                }
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </AnimatePresence>
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox; 