import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('No userId found in auth');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await checkUser();
    if (!user) {
      console.error('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user stats directly from the user record
    return NextResponse.json({
      rewardPoints: user.rewardPoints,
      streak: user.streak,
      level: user.level
    });
  } catch (error) {
    console.error('Error in stats API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
} 