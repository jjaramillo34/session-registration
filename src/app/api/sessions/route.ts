import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: [
        { sessionDate: 'asc' },
        { sessionTime: 'asc' }
      ]
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 