'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

import ChallengeCard from './ChallengeCard';
import UserProgress from './UserProgress';
import FilterTabs from './FilterTabs';
import RewardModal from './RewardModal';
import { useChallenges } from '@/app/lib/hooks/useChallenges';

export default function ChallengesPage() {
  // Use our custom hook to manage challenges
  const { 
    challenges, 
    loading, 
    error, 
    userStats,
    startChallenge,
    completeChallenge,
    refreshChallenges
  } = useChallenges();
  
  // Filter state
  const [activeType, setActiveType] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  
  // Reward modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  
  // Filtered challenges
  const filteredChallenges = challenges.filter(challenge => {
    // Filter by type
    if (activeType !== 'ALL' && challenge.type !== activeType) {
      return false;
    }
    
    // Filter by status
    if (activeStatus !== 'ALL' && challenge.status !== activeStatus) {
      return false;
    }
    
    return true;
  });
  
  // Handle starting a challenge
  const handleStartChallenge = async (id) => {
    try {
      await startChallenge(id);
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };
  
  // Handle completing a challenge
  const handleCompleteChallenge = async (id) => {
    try {
      const result = await completeChallenge(id);
      
      // Show reward modal
      setRewardData({
        points: result.rewards.points,
        xp: result.rewards.xp,
        streak: result.rewards.streak,
        level: result.rewards.level,
        prevLevel: userStats.level
      });
      
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    }
  };
  
  // Page animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🎯 Challenge Hub
          </h1>
          <p className="text-gray-600 mb-6">
            Complete challenges, earn rewards, and build your financial habits
          </p>
        </motion.div>
        
        {/* User Progress */}
        <UserProgress stats={userStats} />
        
        {/* Filter Tabs */}
        <FilterTabs 
          activeType={activeType}
          activeStatus={activeStatus}
          onTypeChange={setActiveType}
          onStatusChange={setActiveStatus}
        />
        
        {/* Challenge Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading challenges...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Error loading challenges. Please try again.</p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={refreshChallenges}
            >
              Retry
            </button>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No challenges found with the selected filters.</p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                setActiveType('ALL');
                setActiveStatus('ALL');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredChallenges.map((challenge, index) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                index={index}
                onStart={handleStartChallenge}
                onComplete={handleCompleteChallenge}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Reward Modal */}
      <RewardModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        reward={rewardData}
      />
    </main>
  );
} 