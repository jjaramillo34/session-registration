import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CrawlRegistration from '@/models/CrawlRegistration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/crawls/pending-emails
 *
 * Returns crawl registrations where emailSent is false and status is CONFIRMED.
 * Designed for Power Automate (or similar) to fetch pending crawl notification emails.
 *
 * Query parameters:
 * - limit: Max number to return (default: 100, max: 500)
 * - markAsSent: If 'true', marks the returned registrations as emailSent: true (default: false)
 *
 * Returns an array of crawl registrations with crawl (event) details included.
 * Each item includes eventType: "crawl" for Power Automate branching.
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const markAsSent = searchParams.get('markAsSent') === 'true';

    const pending = await CrawlRegistration.find({
      $or: [{ emailSent: false }, { emailSent: { $exists: false } }],
      status: 'CONFIRMED',
    })
      .limit(limit)
      .sort({ createdAt: 1 })
      .populate('crawlId')
      .lean();

    const crawlRegistrations = pending.map((reg: any) => {
      const crawl = reg.crawlId;
      return {
        eventType: 'crawl',
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

    if (markAsSent && crawlRegistrations.length > 0) {
      const ids = crawlRegistrations.map((r) => r._id);
      await CrawlRegistration.updateMany(
        { _id: { $in: ids } },
        { $set: { emailSent: true } }
      );
    }

    return NextResponse.json({
      count: crawlRegistrations.length,
      registrations: crawlRegistrations,
      markedAsSent: markAsSent,
    });
  } catch (error) {
    console.error('Failed to fetch pending crawl email registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending crawl email registrations' },
      { status: 500 }
    );
  }
}
