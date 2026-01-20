import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ program: string }> | { program: string } }
) {
  try {
    await connectDB();
    
    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const programId = resolvedParams.program;
    
    // Check if the program parameter is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(programId);
    
    if (!isObjectId) {
      console.error(`Invalid ObjectId format: ${programId}`);
      return NextResponse.json(
        { message: 'Invalid program ID format' },
        { status: 400 }
      );
    }

    // Find the session by _id to get the program name
    const referenceSession = await Session.findById(programId).lean();
    
    if (!referenceSession) {
      return NextResponse.json(
        { message: 'Program not found' },
        { status: 404 }
      );
    }

    const programName = referenceSession.programName;

    // Fetch all sessions for the same program (case-insensitive)
    const sessions = await Session.find({
      programName: { $regex: new RegExp(`^${programName}$`, 'i') }
    })
      .sort({ sessionDate: 1, sessionTime: 1 })
      .lean();

    // Convert MongoDB _id to string for JSON serialization
    const sessionsWithStringIds = sessions.map(session => ({
      ...session,
      _id: session._id.toString(),
    }));

    console.log(`Found ${sessions.length} sessions for program: ${programName}`);
    return NextResponse.json(sessionsWithStringIds);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 