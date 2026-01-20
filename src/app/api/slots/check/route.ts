import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';

const DATES = ['2025-02-26', '2025-02-27', '2025-02-28'];

export async function GET() {
  try {
    await connectDB();
    const slots = await TimeSlot.find({
      date: { $in: DATES }
    })
      .sort({ date: 1, time: 1 })
      .lean();

    const totalSlots = slots.length;
    const availableSlots = slots.filter(slot => slot.available).length;

    return NextResponse.json({
      total: totalSlots,
      available: availableSlots,
      slots
    });
  } catch (error) {
    console.error('Failed to check slots:', error);
    return NextResponse.json(
      { error: 'Failed to check slots' },
      { status: 500 }
    );
  }
} 