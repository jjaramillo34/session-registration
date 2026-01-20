import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';

export async function GET() {
  try {
    await connectDB();
    const availableSlots = await TimeSlot.find({ available: true })
      .sort({ date: 1, time: 1 })
      .lean();

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
} 