import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export async function GET() {
  try {
    const slots = await prisma.timeSlot.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    return NextResponse.json({
      total: slots.length,
      available: slots.filter((slot: TimeSlot) => slot.available).length,
      slots: slots
    });
  } catch (error) {
    console.error('Failed to check slots:', error);
    return NextResponse.json(
      { error: 'Failed to check slots' },
      { status: 500 }
    );
  }
} 