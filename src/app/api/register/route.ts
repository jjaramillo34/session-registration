import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, programName, daytimeSession1, daytimeSession2, eveningSession } = body;

    // Validate required fields
    if (!name || !email || !programName || 
        !daytimeSession1?.date || !daytimeSession1?.time ||
        !daytimeSession2?.date || !daytimeSession2?.time ||
        !eveningSession?.date || !eveningSession?.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Check slot availability and capacity for all sessions
      const slots = await tx.timeSlot.findMany({
        where: {
          OR: [
            { date: daytimeSession1.date, time: daytimeSession1.time, sessionType: 'daytime' },
            { date: daytimeSession2.date, time: daytimeSession2.time, sessionType: 'daytime' },
            { date: eveningSession.date, time: eveningSession.time, sessionType: 'evening' }
          ]
        }
      });

      if (slots.length !== 3) {
        throw new Error('One or more selected time slots are not found');
      }

      // Check if any slot is unavailable or has no capacity
      const unavailableSlot = slots.find(slot => !slot.available || slot.capacity <= 0);
      if (unavailableSlot) {
        throw new Error(`Time slot ${unavailableSlot.date} ${unavailableSlot.time} is no longer available`);
      }

      // Validate that daytime sessions are on different dates
      if (daytimeSession1.date === daytimeSession2.date) {
        throw new Error('Daytime sessions must be on different dates');
      }

      // Create sessions
      const [session1, session2, session3] = await Promise.all([
        // First daytime session
        tx.session.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            programName: programName.trim(),
            sessionDate: daytimeSession1.date,
            sessionTime: daytimeSession1.time,
            sessionType: 'daytime',
            teamsLink: ''
          }
        }),
        // Second daytime session
        tx.session.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            programName: programName.trim(),
            sessionDate: daytimeSession2.date,
            sessionTime: daytimeSession2.time,
            sessionType: 'daytime',
            teamsLink: ''
          }
        }),
        // Evening session
        tx.session.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            programName: programName.trim(),
            sessionDate: eveningSession.date,
            sessionTime: eveningSession.time,
            sessionType: 'evening',
            teamsLink: ''
          }
        })
      ]);

      // Update slots based on new registration
      await Promise.all(slots.map(async (slot) => {
        const newCapacity = slot.capacity - 1;
        return tx.timeSlot.update({
          where: { id: slot.id },
          data: { 
            capacity: newCapacity,
            available: newCapacity > 0
          }
        });
      }));

      return { session1, session2, session3 };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to register sessions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to register sessions' },
      { status: 400 }
    );
  }
} 