# Challenge System Setup Guide

This guide will help you set up the new Challenge System feature for your finance platform. The system includes gamification elements like streaks, rewards, and levels to encourage users to practice good financial habits.

## Features

- 🎯 **Challenges**: Daily, weekly, and monthly financial challenges
- 🏆 **Rewards**: Points and XP for completing challenges
- 🔥 **Streaks**: Track daily completion streaks
- 📈 **Levels**: Level up as you earn more XP
- 🎮 **Gamification**: Celebration animations and rewards modal

## Database Setup

1. First, apply the database migrations to add the new tables:

```bash
npx prisma migrate dev --name add_challenges
```

2. Seed the database with initial challenges:

```bash
npm run seed
```

## Structure

The challenge system is structured as follows:

- **API Routes**:
  - `GET /api/challenges` - Get all challenges with user progress
  - `POST /api/challenges/start` - Start a challenge
  - `POST /api/challenges/complete` - Complete a challenge and get rewards

- **UI Components**:
  - `ChallengeCard` - Display challenge with start/complete buttons
  - `FilterTabs` - Filter challenges by type or status
  - `UserProgress` - Show user rewards, streaks and level
  - `RewardModal` - Animated celebration when completing challenges

- **Database Models**:
  - `Challenge` - Challenge definitions
  - `UserChallenge` - User progress on challenges
  - Added fields to `User` model for rewards

## Usage

Once set up, users can:

1. View all available challenges on the Challenges page
2. Start challenges they want to work on
3. Mark challenges as complete when done
4. Earn rewards, maintain streaks, and level up
5. Filter challenges by type (daily/weekly/monthly) or status

## Customization

You can customize the challenges by editing the `prisma/seed.js` file and adding more challenges or changing existing ones. 