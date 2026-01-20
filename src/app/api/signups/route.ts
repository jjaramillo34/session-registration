import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Signup from '@/models/Signup';
import Session from '@/models/Session';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, sessionId } = body;

    // Validate required fields
    if (!name || !email || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert sessionId to ObjectId if it's a string
    const sessionObjectId = mongoose.Types.ObjectId.isValid(sessionId) 
      ? new mongoose.Types.ObjectId(sessionId) 
      : sessionId;

    // Create signup
    const signup = await Signup.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      sessionId: sessionObjectId
    });

    // Populate session
    await signup.populate('sessionId');

    return NextResponse.json(signup);
  } catch (error) {
    console.error('Failed to create signup:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create signup' },
      { status: 400 }
    );
  }
} 