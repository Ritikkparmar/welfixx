'use client';

import { motion } from 'framer-motion';

export default function UserProgress({ stats }) {
  const { rewardPoints, streak, level } = stats;
  
  // Calculate XP progress to next level (100 XP per level)
  const xpToNextLevel = 100;
  const currentLevelXP = rewardPoints % xpToNextLevel;
  const progressPercent = (currentLevelXP / xpToNextLevel) * 100;
  
  return (
    <div className="mb-8">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Level Card */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-5 shadow-lg"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold opacity-90">Your Level</h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">{level}</span>
            <div className="ml-3 flex-1">
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white" 
                  style={{ width: `${progressPercent}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
              </div>
              <p className="text-xs mt-1 opacity-90">{currentLevelXP}/{xpToNextLevel} XP to next level</p>
            </div>
          </div>
        </motion.div>
        
        {/* Reward Points Card */}
        <motion.div 
          className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-5 shadow-lg"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold opacity-90">Reward Points</h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">{rewardPoints}</span>
            <div className="ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs mt-1 opacity-90">Use points to unlock rewards</p>
        </motion.div>
        
        {/* Streak Card */}
        <motion.div 
          className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl p-5 shadow-lg"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold opacity-90">Activity Streak</h3>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold">{streak}</span>
            <div className="ml-3">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          <p className="text-xs mt-1 opacity-90">Complete a challenge daily to maintain</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 