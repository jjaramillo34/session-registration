import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import CrawlRegistration from '@/models/CrawlRegistration';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/notifications/pending-emails
 *
 * Returns all pending email notifications for both event types in one response.
 * Each item has eventType: "virtual_session" | "crawl" so Power Automate can branch.
 *
 * Query parameters:
 * - limit: Max total items (default: 100, max: 500). Applied across both types.
 * - markAsSent: If 'true', marks returned items as emailSent: true (default: false)
 *
 * Response: { count, registrations: [...], markedAsSent }
 * Each registration has eventType, _id, name, email, ... and either session or crawl.
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limitTotal = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const markAsSent = searchParams.get('markAsSent') === 'true';

    // Fetch pending session registrations (half of limit each, or proportional)
    const sessionLimit = Math.ceil(limitTotal / 2);
    const pendingSession = await Registration.find({
      $or: [{ emailSent: false }, { emailSent: { $exists: false } }],
      status: 'CONFIRMED',
    })
      .limit(sessionLimit)
      .sort({ createdAt: 1 })
      .lean();

    const crawlLimit = limitTotal - pendingSession.length;
    const pendingCrawl = await CrawlRegistration.find({
      $or: [{ emailSent: false }, { emailSent: { $exists: false } }],
      status: 'CONFIRMED',
    })
      .limit(crawlLimit)
      .sort({ createdAt: 1 })
      .populate('crawlId')
      .lean();

    const sessionRegs = await Promise.all(
      pendingSession.map(async (reg: any) => {
        const session = await Session.findById(reg.sessionId).lean();
        return {
          eventType: 'virtual_session' as const,
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

    const crawlRegs = pendingCrawl.map((reg: any) => {
      const crawl = reg.crawlId;
      return {
        eventType: 'crawl' as const,
        _id: reg._id.toString(),
        name: reg.name,
        email: reg.email,
        status: reg.status,
        emailSent: reg.emailSent ?? false,
        createdAt: reg.createdAt ? reg.createdAt.toISOString() : '',
        crawl: crawl
          ? {
              _id: crawl._id.toString(),
              name: crawl.name,
              location: crawl.location,
              address: crawl.address,
              date: crawl.date,
              time: crawl.time,
              endTime: crawl.endTime ?? null,
              borough: crawl.borough ?? null,
            }
          : null,
      };
    });

    const combined = [...sessionRegs, ...crawlRegs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (markAsSent && combined.length > 0) {
      const sessionIds = combined.filter((r) => r.eventType === 'virtual_session').map((r) => r._id);
      const crawlIds = combined.filter((r) => r.eventType === 'crawl').map((r) => r._id);
      if (sessionIds.length > 0) {
        await Registration.updateMany({ _id: { $in: sessionIds } }, { $set: { emailSent: true } });
      }
      if (crawlIds.length > 0) {
        await CrawlRegistration.updateMany({ _id: { $in: crawlIds } }, { $set: { emailSent: true } });
      }
    }

    return NextResponse.json({
      count: combined.length,
      registrations: combined,
      markedAsSent: markAsSent,
    });
  } catch (error) {
    console.error('Failed to fetch pending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending notifications' },
      { status: 500 }
    );
  }
}
