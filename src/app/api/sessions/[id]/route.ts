import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { teamsLink } = body;

    const updatedSession = await prisma.session.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        teamsLink,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
} 