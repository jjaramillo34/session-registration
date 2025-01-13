import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, sessionId } = body;

    // Validate required fields
    if (!name || !email || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create signup
    const signup = await prisma.signup.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        sessionId: sessionId
      },
      include: {
        session: true
      }
    });

    return NextResponse.json(signup);
  } catch (error) {
    console.error('Failed to create signup:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create signup' },
      { status: 400 }
    );
  }
} 