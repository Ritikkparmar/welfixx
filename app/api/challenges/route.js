import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

// GET /api/challenges - Get all challenges with user progress
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error('No userId found in auth');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await checkUser();
    if (!user) {
      console.error('User not found in database');
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all challenges
    const challenges = await db.challenge.findMany({
      orderBy: { createdAt: "asc" }
    });

    if (!challenges || challenges.length === 0) {
      console.log('No challenges found in database');
      return NextResponse.json([]);
    }

    // Get user's progress on these challenges
    const userChallenges = await db.userChallenge.findMany({
      where: { userId: user.id }
    });

    // Map user progress to challenges
    const challengesWithProgress = challenges.map(challenge => {
      const userProgress = userChallenges.find(uc => uc.challengeId === challenge.id);
      
      return {
        ...challenge,
        status: userProgress?.status || "NOT_STARTED",
        startedAt: userProgress?.startedAt || null,
        completedAt: userProgress?.completedAt || null
      };
    });

    return NextResponse.json(challengesWithProgress);
  } catch (error) {
    console.error("Error in challenges API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch challenges" },
      { status: 500 }
    );
  }
} 