import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/registrations/mark-email-sent
 * 
 * Marks one or more registrations as emailSent: true.
 * This endpoint is designed for Power Automate to mark emails as sent after processing.
 * 
 * Request body:
 * {
 *   "registrationIds": ["id1", "id2", ...] // Array of registration IDs
 * }
 * 
 * Returns the number of registrations updated.
 */
export async function POST(request: Request) {
  try {
    // Optional: Add API key authentication for Power Automate
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.POWER_AUTOMATE_API_KEY) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

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

    // Validate all IDs are valid ObjectIds
    const validIds = registrationIds.filter((id: string) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid registration IDs provided' },
        { status: 400 }
      );
    }

    // Update registrations
    const result = await Registration.updateMany(
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
    console.error('Failed to mark emails as sent:', error);
    return NextResponse.json(
      { error: 'Failed to mark emails as sent' },
      { status: 500 }
    );
  }
}
