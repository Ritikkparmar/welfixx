"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import ChallengeCard from "./ChallengeCard";
import UserProgress from "./UserProgress";
import FilterTabs from "./FilterTabs";
import RewardModal from "./RewardModal";
import CreateChallengeForm from "./CreateChallengeForm";
import { useChallenges } from "@/app/lib/hooks/useChallenges";

export default function ChallengesPage() {
  // Use our custom hook to manage challenges
  const {
    challenges,
    loading,
    error,
    userStats,
    startChallenge,
    completeChallenge,
    refreshChallenges,
    createChallenge,
  } = useChallenges();

  // Filter state
  const [activeType, setActiveType] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("ALL");

  // Reward modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [rewardData, setRewardData] = useState(null);

  // Create challenge form state
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filtered challenges
  const filteredChallenges = challenges.filter((challenge) => {
    // Filter by type
    if (activeType !== "ALL" && challenge.type !== activeType) {
      return false;
    }

    // Filter by status
    if (activeStatus !== "ALL" && challenge.status !== activeStatus) {
      return false;
    }

    return true;
  });

  // Handle starting a challenge
  const handleStartChallenge = async (id) => {
    try {
      await startChallenge(id);
    } catch (error) {
      console.error("Failed to start challenge:", error);
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
        prevLevel: userStats.level,
      });

      setModalOpen(true);
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  // Handle creating a new challenge
  const handleCreateChallenge = async (data) => {
    try {
      await createChallenge(data);
      setShowCreateForm(false);
      refreshChallenges();
    } catch (error) {
      console.error("Failed to create challenge:", error);
      throw error; // Re-throw to be handled by the form
    }
  };

  // Page animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-6xl font-bold tracking-tight gradient-title">
              Challenge Hub
            </h1>
            <p className="text-gray-600">
              Complete challenges, earn rewards, and build your financial habits
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Challenge
          </button>
        </motion.div>

        {/* User Progress */}
        <UserProgress stats={userStats} />

        {/* Create Challenge Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateChallengeForm
              onSubmit={handleCreateChallenge}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

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
                setActiveType("ALL");
                setActiveStatus("ALL");
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
