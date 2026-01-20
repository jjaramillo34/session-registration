import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import Registration from '@/models/Registration';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, language, programName, timeSlotId, isNYCPSStaff, agencyName } = body;

    // Validate required fields
    if (!name || !email || !programName || !timeSlotId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Convert timeSlotId to ObjectId if it's a string
    const sessionId = mongoose.Types.ObjectId.isValid(timeSlotId) 
      ? new mongoose.Types.ObjectId(timeSlotId) 
      : timeSlotId;

    // Get the session
    const session = await Session.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if session is at capacity
    const registrationCount = await Registration.countDocuments({
      sessionId: sessionId,
      status: 'CONFIRMED'
    });

    const sessionCapacity = session.capacity || 16; // Default to 16 if not set

    if (registrationCount >= sessionCapacity) {
      return NextResponse.json(
        { message: 'This session is at full capacity' },
        { status: 400 }
      );
    }

    // Check if user is already registered for this session
    const existingRegistration = await Registration.findOne({
      email,
      sessionId: sessionId,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this session' },
        { status: 400 }
      );
    }

    // Create the registration
    const registration = await Registration.create({
      name,
      email,
      language: language || 'ENGLISH',
      programName,
      agencyName,
      isNYCPSStaff,
      sessionId: sessionId,
    });

    return NextResponse.json({
      message: 'Registration confirmed',
      registration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 