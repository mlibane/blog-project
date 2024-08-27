// components/LoadingScreen.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoadingScreen = sessionStorage.getItem('hasSeenLoadingScreen');
    
    if (!hasSeenLoadingScreen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasSeenLoadingScreen', 'true');
      }, 3000); // Adjust time as needed

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);
  const nameVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="300" height="100" viewBox="0 0 300 100" aria-hidden="true">
          <motion.path
            d="M10 80 Q50 10 90 80 M110 80 L110 20 M130 80 L130 20 Q170 20 170 50 Q170 80 130 80 M190 20 L190 80 M210 20 L250 80 M250 20 L210 80"
            fill="transparent"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={nameVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;