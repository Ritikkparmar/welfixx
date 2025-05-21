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
      { error: "Failed to fetch challenges", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/challenges - Create a new challenge
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
    const { title, description, type, difficulty, reward, xpPoints } = body;

    // Validate required fields
    if (!title || !description || !type || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate challenge type
    const validTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid challenge type" },
        { status: 400 }
      );
    }

    // Validate difficulty
    const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    // Create the challenge
    const challenge = await db.challenge.create({
      data: {
        title,
        description,
        type,
        difficulty,
        reward: reward || 100,
        xpPoints: xpPoints || 50,
        status: 'ACTIVE'
      }
    });

    // Create initial user challenge progress
    await db.userChallenge.create({
      data: {
        userId: user.id,
        challengeId: challenge.id,
        status: 'NOT_STARTED'
      }
    });

    // Return the challenge with the user's status
    return NextResponse.json({
      ...challenge,
      status: 'NOT_STARTED',
      startedAt: null,
      completedAt: null
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create challenge" },
      { status: 500 }
    );
  }
} 