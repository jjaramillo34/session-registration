import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Crawl from '@/models/Crawl';
import CrawlRegistration from '@/models/CrawlRegistration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllCrawls() {
  return Crawl.find({})
    .sort({ borough: 1, name: 1 })
    .lean();
}

export async function GET() {
  try {
    await connectDB();
    const crawls = await getAllCrawls();
    // Log to verify: this route only READS. If total grows, something else is creating crawls.
    const totalCrawls = crawls.length;
    console.log(`[GET /api/crawls] Crawls in DB: ${totalCrawls} (this route never creates crawls)`);

    const crawlsWithCounts = await Promise.all(
      crawls.map(async (crawl) => {
        const count = await CrawlRegistration.countDocuments({
          crawlId: crawl._id,
          status: 'CONFIRMED',
        });
        return {
          ...crawl,
          id: crawl._id.toString(),
          _count: {
            registrations: count,
          },
        };
      })
    );

    const res = NextResponse.json(crawlsWithCounts);
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  } catch (error) {
    console.error('Failed to fetch crawls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawls' },
      { status: 500 }
    );
  }
} 