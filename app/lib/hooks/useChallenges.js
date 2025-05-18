'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [userStats, setUserStats] = useState({
    rewardPoints: 0,
    streak: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all challenges with user progress
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const [challengesResponse, userStatsResponse] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/challenges/stats')
      ]);
      
      if (!challengesResponse.ok) {
        const errorData = await challengesResponse.json();
        console.error('Challenges API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch challenges');
      }
      
      if (!userStatsResponse.ok) {
        const errorData = await userStatsResponse.json();
        console.error('User Stats API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch user stats');
      }
      
      const [challengesData, userStatsData] = await Promise.all([
        challengesResponse.json(),
        userStatsResponse.json()
      ]);
      
      setChallenges(challengesData);
      setUserStats({
        rewardPoints: userStatsData.rewardPoints,
        streak: userStatsData.streak,
        level: userStatsData.level
      });
    } catch (err) {
      console.error('Error in fetchChallenges:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  // Create a new challenge
  const createChallenge = async (challengeData) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create challenge');
      }
      
      const newChallenge = await response.json();
      
      // Update local state with the new challenge
      setChallenges(prev => [...prev, newChallenge]);
      
      toast.success('Challenge created successfully!');
      return newChallenge;
    } catch (err) {
      console.error('Error creating challenge:', err);
      toast.error(err.message || 'Failed to create challenge');
      throw err;
    }
  };

  // Start a challenge
  const startChallenge = async (challengeId) => {
    try {
      const response = await fetch('/api/challenges/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start challenge');
      }
      
      toast.success('Challenge started!');
      
      // Update local state
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: 'IN_PROGRESS', startedAt: new Date() }
          : challenge
      ));
      
      return await response.json();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  // Complete a challenge
  const completeChallenge = async (challengeId) => {
    try {
      const response = await fetch('/api/challenges/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete challenge');
      }
      
      const data = await response.json();
      
      // Update reward points and streak in local state
      setUserStats(prev => ({
        rewardPoints: data.rewards.newTotalPoints,
        streak: data.rewards.streak,
        level: data.rewards.level
      }));
      
      // Update challenge status in local state
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, status: 'COMPLETED', completedAt: new Date() }
          : challenge
      ));
      
      toast.success(`Challenge completed! +${data.rewards.points} points, +${data.rewards.xp} XP`);
      
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  // Load challenges on component mount
  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
    userStats,
    startChallenge,
    completeChallenge,
    createChallenge,
    refreshChallenges: fetchChallenges
  };
} 