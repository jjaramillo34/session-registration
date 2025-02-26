import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, crawlId } = body;

    // Validate required fields
    if (!name || !email || !crawlId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate @schools.nyc.gov email
    if (!email.toLowerCase().endsWith('@schools.nyc.gov')) {
      return NextResponse.json(
        { message: 'Only @schools.nyc.gov email addresses are allowed' },
        { status: 400 }
      );
    }

    // Get the crawl
    const crawl = await prisma.crawl.findUnique({
      where: { id: crawlId },
    });

    if (!crawl) {
      return NextResponse.json(
        { message: 'Crawl not found' },
        { status: 404 }
      );
    }

    // Check if crawl is full
    const registrationCount = await prisma.crawlRegistration.count({
      where: {
        crawlId,
        status: 'CONFIRMED'
      }
    });

    if (registrationCount >= crawl.capacity) {
      return NextResponse.json(
        { message: 'This crawl is at full capacity' },
        { status: 400 }
      );
    }

    // Check if user is already registered for this crawl
    const existingRegistration = await prisma.crawlRegistration.findFirst({
      where: {
        email,
        crawlId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this crawl' },
        { status: 400 }
      );
    }

    // Create the registration
    const registration = await prisma.crawlRegistration.create({
      data: {
        name,
        email: email.toLowerCase(),
        crawlId,
      },
      include: {
        crawl: true,
      },
    });

    // Update crawl availability if at capacity
    if (registrationCount + 1 >= crawl.capacity) {
      await prisma.crawl.update({
        where: { id: crawlId },
        data: { available: false },
      });
    }

    return NextResponse.json({
      message: 'Registration confirmed',
      registration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 