import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import { MeetingType } from '@/types/session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function to detect meeting type from URL
function detectMeetingTypeFromUrl(url: string): MeetingType {
  if (!url) return MeetingType.NONE;
  
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('zoom.us') || lowerUrl.includes('zoom.com')) {
    return MeetingType.ZOOM;
  }
  if (lowerUrl.includes('teams.microsoft.com') || lowerUrl.includes('teams.office.com')) {
    return MeetingType.TEAMS;
  }
  return MeetingType.NONE;
}

export async function GET() {
  try {
    await connectDB();

    // Get all sessions
    const sessions = await Session.find({})
      .sort({ sessionDate: 1, sessionTime: 1 })
      .lean();

    // Transform sessions to include meeting info and filter only those with meeting links
    const meetings = sessions
      .map(session => {
        // Determine meeting link (prefer meetingLink, fallback to teamsLink)
        const meetingLink = session.meetingLink || session.teamsLink || '';
        
        // Skip sessions without meeting links
        if (!meetingLink || meetingLink.trim() === '') {
          return null;
        }

        // Determine meeting type
        let meetingType = session.meetingType;
        
        // If no meetingType is set, try to detect from URL
        if (!meetingType || meetingType === MeetingType.NONE) {
          meetingType = detectMeetingTypeFromUrl(meetingLink);
        }
        
        // If still no type detected and we have teamsLink, assume Teams for backward compatibility
        if ((!meetingType || meetingType === MeetingType.NONE) && session.teamsLink) {
          meetingType = MeetingType.TEAMS;
        }

        // Only return if we have a valid meeting type and link
        if (meetingType === MeetingType.NONE) {
          return null;
        }

        return {
          _id: session._id.toString(),
          programName: session.programName,
          sessionDate: session.sessionDate,
          sessionTime: session.sessionTime,
          sessionType: session.sessionType,
          meetingType,
          meetingLink: meetingLink.trim(),
          capacity: session.capacity || 16,
        };
      })
      .filter((meeting): meeting is NonNullable<typeof meeting> => meeting !== null);

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}
