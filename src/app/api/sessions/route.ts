import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const sessions = await Session.find()
      .sort({ sessionDate: 1, sessionTime: 1 })
      .lean();

    // Convert MongoDB _id to string for JSON serialization
    const sessionsWithStringIds = sessions.map(session => ({
      ...session,
      _id: session._id.toString(),
    }));

    return NextResponse.json(sessionsWithStringIds);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 