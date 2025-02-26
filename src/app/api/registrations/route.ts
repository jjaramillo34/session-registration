import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        session: {
          select: {
            sessionDate: true,
            sessionTime: true,
            sessionType: true,
          },
        },
      },
      orderBy: [
        {
          session: {
            sessionDate: 'desc',
          },
        },
        {
          session: {
            sessionTime: 'asc',
          },
        },
      ],
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 