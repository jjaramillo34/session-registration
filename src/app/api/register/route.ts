import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
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

    // Get the session
    const session = await prisma.session.findUnique({
      where: { id: timeSlotId },
    });

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if user is already registered for this session
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        email,
        sessionId: timeSlotId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this session' },
        { status: 400 }
      );
    }

    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        name,
        email,
        language: language || 'ENGLISH',
        programName,
        agencyName,
        isNYCPSStaff,
        sessionId: timeSlotId,
      },
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