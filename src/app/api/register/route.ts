import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface RegistrationData {
  name: string;
  email: string;
  programName: string;
  daytimeSession1: {
    date: string;
    time: string;
  };
  eveningSession: {
    date: string;
    time: string;
  };
}

export async function POST(request: Request) {
  console.log('🚀 Registration request received');
  
  try {
    const data: RegistrationData = await request.json();
    console.log('📦 Received data:', JSON.stringify(data, null, 2));

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check if slots exist and have capacity using raw query
      const availableSlots = await tx.$queryRaw`
        SELECT id, date, time, capacity, available, "sessionType"
        FROM "TimeSlot"
        WHERE (date = ${data.daytimeSession1.date} AND time = ${data.daytimeSession1.time}
           OR date = ${data.eveningSession.date} AND time = ${data.eveningSession.time})
          AND available = true
          AND capacity > 0
      `;

      const slots = availableSlots as { 
        id: number;
        date: string;
        time: string;
        capacity: number;
        available: boolean;
        sessionType: string;
      }[];

      console.log('🔍 Found available slots:', slots.length);

      if (slots.length !== 2) {
        return NextResponse.json(
          { error: 'One or more selected slots are not available' },
          { status: 400 }
        );
      }

      // Create sessions
      const sessions = await Promise.all([
        tx.session.create({
          data: {
            name: data.name,
            email: data.email,
            programName: data.programName,
            sessionDate: data.daytimeSession1.date,
            sessionTime: data.daytimeSession1.time,
            sessionType: 'daytime',
          }
        }),
        tx.session.create({
          data: {
            name: data.name,
            email: data.email,
            programName: data.programName,
            sessionDate: data.eveningSession.date,
            sessionTime: data.eveningSession.time,
            sessionType: 'evening',
          }
        })
      ]);

      // Update slot capacity and availability using raw query
      await Promise.all(
        slots.map(slot => 
          tx.$executeRaw`
            UPDATE "TimeSlot"
            SET capacity = capacity - 1,
                available = CASE WHEN capacity - 1 > 0 THEN true ELSE false END
            WHERE id = ${slot.id}
          `
        )
      );

      return sessions;
    });

    return NextResponse.json({ success: true, sessions: result });

  } catch (error) {
    console.error('❌ Registration failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to register' },
      { status: 500 }
    );
  }
} 