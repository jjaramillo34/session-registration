import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CrawlRegistration from '@/models/CrawlRegistration';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/crawls/mark-email-sent
 *
 * Marks one or more crawl registrations as emailSent: true.
 * For use after Power Automate (or similar) has sent notification emails.
 *
 * Request body:
 * { "registrationIds": ["id1", "id2", ...] }
 */
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { registrationIds } = body;

    if (!registrationIds || !Array.isArray(registrationIds)) {
      return NextResponse.json(
        { error: 'registrationIds must be an array' },
        { status: 400 }
      );
    }

    if (registrationIds.length === 0) {
      return NextResponse.json(
        { error: 'registrationIds array cannot be empty' },
        { status: 400 }
      );
    }

    const validIds = registrationIds.filter((id: string) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid registration IDs provided' },
        { status: 400 }
      );
    }

    const result = await CrawlRegistration.updateMany(
      { _id: { $in: validIds } },
      { $set: { emailSent: true } }
    );

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      requestedCount: registrationIds.length,
      validCount: validIds.length,
    });
  } catch (error) {
    console.error('Failed to mark crawl emails as sent:', error);
    return NextResponse.json(
      { error: 'Failed to mark crawl emails as sent' },
      { status: 500 }
    );
  }
}
