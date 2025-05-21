import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Check if challenge exists
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Check if user already completed this challenge
    const existingUserChallenge = await db.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId
        }
      }
    });

    if (!existingUserChallenge || existingUserChallenge.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Challenge not in progress" },
        { status: 400 }
      );
    }

    if (existingUserChallenge.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Challenge already completed" },
        { status: 400 }
      );
    }

    // Complete the challenge
    const userChallenge = await db.userChallenge.update({
      where: {
        id: existingUserChallenge.id
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    // Check if user streak should be updated (if completed today)
    const today = new Date().toDateString();
    const isToday = user.lastActive 
      ? new Date(user.lastActive).toDateString() === today
      : false;

    // Calculate new level based on XP
    const newXP = user.rewardPoints + challenge.xpPoints;
    const newLevel = Math.floor(newXP / 100) + 1; // Simple level formula: 100 XP per level

    // Update user rewards, XP, and streak
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        rewardPoints: { increment: challenge.reward + challenge.xpPoints }, // Add both reward and XP points
        streak: isToday ? user.streak : user.streak + 1,
        lastActive: new Date(),
        level: newLevel
      }
    });

    return NextResponse.json({
      userChallenge,
      rewards: {
        points: challenge.reward,
        xp: challenge.xpPoints,
        newTotalPoints: updatedUser.rewardPoints,
        streak: updatedUser.streak,
        level: updatedUser.level
      }
    });
  } catch (error) {
    console.error("Error completing challenge:", error);
    return NextResponse.json(
      { error: "Failed to complete challenge" },
      { status: 500 }
    );
  }
} 