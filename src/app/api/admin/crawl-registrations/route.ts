import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CrawlRegistration from '@/models/CrawlRegistration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const registrations = await CrawlRegistration.find()
      .populate('crawlId')
      .sort({ createdAt: -1 })
      .lean();

    const transformed = registrations.map((reg: any) => {
      const crawl = reg.crawlId;
      return {
        _id: reg._id.toString(),
        name: reg.name,
        email: reg.email,
        status: reg.status,
        emailSent: reg.emailSent ?? false,
        crawlId: reg.crawlId?._id?.toString() ?? null,
        crawlName: crawl?.name ?? '',
        crawlLocation: crawl?.location ?? '',
        crawlAddress: crawl?.address ?? '',
        crawlDate: crawl?.date ?? '',
        crawlTime: crawl?.time ?? '',
        crawlEndTime: crawl?.endTime ?? '',
        createdAt: reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
      };
    });

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Failed to fetch crawl registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawl registrations' },
      { status: 500 }
    );
  }
}
