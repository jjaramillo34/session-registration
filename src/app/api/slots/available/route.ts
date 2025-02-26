import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const DATES = ['2025-02-26', '2025-02-27', '2025-02-28'];

export async function GET() {
  try {
    console.log('Fetching available slots for dates:', DATES);
    
    // Only fetch slots that are both available=true and have capacity>0
    const slots = await prisma.timeSlot.findMany({
      where: {
        date: {
          in: DATES
        },
        AND: [
          { available: true },
          { capacity: { gt: 0 } }
        ]
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    console.log('\nAvailable slots with capacity:');
    for (const slot of slots) {
      console.log(`Date: ${slot.date}, Time: ${slot.time}, Type: ${slot.sessionType}`);
      console.log(`Capacity: ${slot.capacity}, Available: ${slot.available}\n`);
    }

    console.log(`\nTotal available slots: ${slots.length}`);

    // Return response with no-cache headers
    return new NextResponse(JSON.stringify({ slots }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
} 