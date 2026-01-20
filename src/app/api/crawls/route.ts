import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Crawl from '@/models/Crawl';
import CrawlRegistration from '@/models/CrawlRegistration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const crawls = await Crawl.find({ available: true })
      .sort({ name: 1 })
      .lean();

    // Get registration counts for each crawl
    const crawlsWithCounts = await Promise.all(
      crawls.map(async (crawl) => {
        const count = await CrawlRegistration.countDocuments({
          crawlId: crawl._id,
          status: 'CONFIRMED'
        });
        return {
          ...crawl,
          _count: {
            registrations: count
          }
        };
      })
    );

    return NextResponse.json(crawlsWithCounts);
  } catch (error) {
    console.error('Failed to fetch crawls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawls' },
      { status: 500 }
    );
  }
} 