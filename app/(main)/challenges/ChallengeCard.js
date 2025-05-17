'use client';
import { motion } from 'framer-motion';

export default function ChallengeCard({ challenge, index, onStart, onComplete }) {
  const { id, title, description, type, status, reward, xpPoints, difficulty } = challenge;
  
  // Status-based styles
  const getStatusStyles = () => {
    switch (status) {
      case 'COMPLETED':
        return {
          borderColor: 'border-green-400',
          bgGradient: 'from-green-50 to-white',
          icon: '✅'
        };
      case 'IN_PROGRESS':
        return {
          borderColor: 'border-blue-400',
          bgGradient: 'from-blue-50 to-white',
          icon: '⏳'
        };
      default:
        return {
          borderColor: 'border-gray-200',
          bgGradient: 'from-gray-50 to-white',
          icon: '🎯'
        };
    }
  };

  const styles = getStatusStyles();
  
  // Difficulty Badge
  const difficultyColor = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      className={`bg-gradient-to-b ${styles.bgGradient} shadow-lg border-2 ${styles.borderColor} rounded-2xl p-6 hover:shadow-xl transition duration-300`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm text-gray-500 font-medium">{type} Challenge</div>
        <div className={`text-xs px-2 py-1 rounded-full ${difficultyColor[difficulty]}`}>
          {difficulty}
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
        <span className="mr-2">{styles.icon}</span>
        {title}
      </h2>
      
      <p className="text-gray-700 mb-4">{description}</p>
      
      <div className="flex items-center mb-4 text-sm">
        <div className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{reward} points</span>
        </div>
        
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-medium">{xpPoints} XP</span>
        </div>
      </div>
      
      {/* Status-based action buttons */}
      <div className="mt-3">
        {status === 'NOT_STARTED' && (
          <motion.button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            onClick={() => onStart(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Challenge
          </motion.button>
        )}
        
        {status === 'IN_PROGRESS' && (
          <motion.button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            onClick={() => onComplete(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Mark as Completed
          </motion.button>
        )}
        
        {status === 'COMPLETED' && (
          <div className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg font-medium text-center">
            Challenge Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}
