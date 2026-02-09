import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/registrations/pending-emails
 * 
 * Returns all registrations where emailSent is false and status is CONFIRMED.
 * This endpoint is designed for Power Automate to fetch pending email notifications.
 * 
 * Query parameters:
 * - limit: Maximum number of registrations to return (default: 100, max: 500)
 * - markAsSent: If 'true', marks the returned registrations as emailSent: true (default: false)
 * 
 * Returns an array of registrations with session details included.
 * Each item includes eventType: "virtual_session" for Power Automate branching.
 */
export async function GET(request: Request) {
  try {
    // Optional: Add API key authentication for Power Automate
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.POWER_AUTOMATE_API_KEY) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const markAsSent = searchParams.get('markAsSent') === 'true';

    // Find registrations where emailSent is false or doesn't exist, and status is CONFIRMED
    // This handles both new registrations (with emailSent: false) and old ones (without the field)
    const pendingRegistrations = await Registration.find({
      $or: [
        { emailSent: false },
        { emailSent: { $exists: false } }
      ],
      status: 'CONFIRMED',
    })
      .limit(limit)
      .sort({ createdAt: 1 }) // Oldest first
      .lean();

    // Populate session details
    const registrationsWithSessions = await Promise.all(
      pendingRegistrations.map(async (reg) => {
        const session = await Session.findById(reg.sessionId).lean();
        return {
          eventType: 'virtual_session',
          _id: reg._id.toString(),
          name: reg.name,
          email: reg.email,
          language: reg.language,
          programName: reg.programName,
          agencyName: reg.agencyName || null,
          isNYCPSStaff: reg.isNYCPSStaff || false,
          status: reg.status,
          emailSent: reg.emailSent || false,
          createdAt: reg.createdAt ? reg.createdAt.toISOString() : new Date().toISOString(),
          session: session
            ? {
                _id: session._id.toString(),
                programName: session.programName,
                sessionDate: session.sessionDate,
                sessionTime: session.sessionTime,
                sessionType: session.sessionType,
                meetingType: session.meetingType || null,
                meetingLink: session.meetingLink || session.teamsLink || null,
              }
            : null,
        };
      })
    );

    // If markAsSent is true, update all returned registrations
    if (markAsSent && registrationsWithSessions.length > 0) {
      const ids = registrationsWithSessions.map((reg) => reg._id);
      await Registration.updateMany(
        { _id: { $in: ids } },
        { $set: { emailSent: true } }
      );
    }

    return NextResponse.json({
      count: registrationsWithSessions.length,
      registrations: registrationsWithSessions,
      markedAsSent: markAsSent,
    });
  } catch (error) {
    console.error('Failed to fetch pending email registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending email registrations' },
      { status: 500 }
    );
  }
}
