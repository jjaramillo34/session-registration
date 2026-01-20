import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import mongoose from 'mongoose';
import { MeetingType } from '@/types/session';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET single session by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();

    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { message: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const session = await Session.findById(sessionId).lean();

    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...session,
      _id: session._id.toString(),
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { message: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

// PATCH update session
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();

    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const sessionId = resolvedParams.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { message: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { meetingType, meetingLink } = body;

    // Validate meeting type
    if (meetingType && !Object.values(MeetingType).includes(meetingType)) {
      return NextResponse.json(
        { message: 'Invalid meeting type' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {};

    if (meetingType !== undefined) {
      updateData.meetingType = meetingType;
    }

    if (meetingLink !== undefined) {
      if (meetingType === MeetingType.NONE || !meetingLink) {
        updateData.meetingLink = null;
        updateData.meetingType = MeetingType.NONE;
      } else {
        updateData.meetingLink = meetingLink;
        // Auto-detect if not explicitly set
        if (!meetingType || meetingType === MeetingType.NONE) {
          const lowerLink = meetingLink.toLowerCase();
          if (lowerLink.includes('zoom.us') || lowerLink.includes('zoom.com')) {
            updateData.meetingType = MeetingType.ZOOM;
          } else if (lowerLink.includes('teams.microsoft.com') || lowerLink.includes('teams.office.com')) {
            updateData.meetingType = MeetingType.TEAMS;
          }
        }
      }
    }

    // Update the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { message: 'Session not found' },
        { status: 404 }
      );
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { $set: updateData },
      { new: true }
    ).lean();

    return NextResponse.json({
      message: 'Session updated successfully',
      session: {
        ...updatedSession,
        _id: updatedSession!._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { message: 'Failed to update session' },
      { status: 500 }
    );
  }
}
