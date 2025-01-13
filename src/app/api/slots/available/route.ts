import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const DATES = ['2025-02-11', '2025-02-12', '2025-02-13'];

export async function GET() {
  try {
    console.log('Fetching all slots with dates:', DATES);
    
    // First get total count to verify
    const countResult = await prisma.$queryRaw`
      SELECT COUNT(*) as total 
      FROM "TimeSlot" 
      WHERE date IN (${DATES[0]}, ${DATES[1]}, ${DATES[2]})
    `;
    console.log('Raw count query result:', countResult);
    
    // Get all slots with raw query
    const allSlots = await prisma.$queryRaw`
      SELECT * 
      FROM "TimeSlot" 
      WHERE date IN (${DATES[0]}, ${DATES[1]}, ${DATES[2]})
      ORDER BY date ASC, time ASC
    `;
    
    console.log('Raw query result length:', allSlots.length);
    console.log('All slots by date:');
    
    // Group and log slots by date
    for (const date of DATES) {
      const dateSlots = (allSlots as any[]).filter(s => s.date === date);
      console.log(`\n${date}: ${dateSlots.length} slots`);
      dateSlots.forEach(slot => {
        console.log(`id: ${slot.id}, time: ${slot.time}, type: ${slot.sessionType}, available: ${slot.available}`);
      });
    }

    // Return all slots
    return NextResponse.json({ slots: allSlots });
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    );
  }
} 