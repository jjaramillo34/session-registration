import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const DATES = ['2025-02-26', '2025-02-27', '2025-02-28'];

export async function GET() {
  try {
    const slots = await prisma.timeSlot.findMany({
      where: {
        date: {
          in: DATES
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

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