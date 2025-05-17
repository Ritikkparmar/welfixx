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

    // Check if user already started this challenge
    const existingUserChallenge = await db.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId
        }
      }
    });

    if (existingUserChallenge) {
      // If already completed, return error
      if (existingUserChallenge.status === "COMPLETED") {
        return NextResponse.json(
          { error: "Challenge already completed" },
          { status: 400 }
        );
      }

      // If already in progress, just return it
      if (existingUserChallenge.status === "IN_PROGRESS") {
        return NextResponse.json(existingUserChallenge);
      }
    }

    // Start the challenge
    const userChallenge = await db.userChallenge.upsert({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId
        }
      },
      update: {
        status: "IN_PROGRESS",
        startedAt: new Date()
      },
      create: {
        userId: user.id,
        challengeId,
        status: "IN_PROGRESS",
        startedAt: new Date()
      }
    });

    return NextResponse.json(userChallenge);
  } catch (error) {
    console.error("Error starting challenge:", error);
    return NextResponse.json(
      { error: "Failed to start challenge" },
      { status: 500 }
    );
  }
} 