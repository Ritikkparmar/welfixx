'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RewardModal({ isOpen, onClose, reward }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Auto-close after animation completes
  useEffect(() => {
    if (isOpen && !animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    if (animationComplete) {
      const timer = setTimeout(() => {
        onClose();
        setAnimationComplete(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationComplete, onClose]);
  
  if (!isOpen || !reward) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Confetti effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  y: -20, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  y: Math.random() * 400, 
                  opacity: 0,
                  scale: Math.random() * 2 + 0.5,
                  transition: {
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut"
                  }
                }}
              />
            ))}
          </motion.div>
          
          <div className="text-center relative z-10">
            <motion.div
              className="mb-6 mx-auto w-20 h-20 flex items-center justify-center bg-yellow-100 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="text-4xl">🏆</span>
            </motion.div>
            
            <motion.h3
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Challenge Completed!
            </motion.h3>
            
            <motion.div
              className="flex justify-center gap-8 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-3xl font-bold text-yellow-500">+{reward.points}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">XP</p>
                <p className="text-3xl font-bold text-blue-500">+{reward.xp}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-3xl font-bold text-red-500">{reward.streak} 🔥</p>
              </div>
            </motion.div>
            
            {reward.level > reward.prevLevel && (
              <motion.div
                className="bg-indigo-100 text-indigo-800 p-3 rounded-lg mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <span className="text-lg font-bold">Level Up! 🎉</span>
                <p>You reached level {reward.level}</p>
              </motion.div>
            )}
            
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 