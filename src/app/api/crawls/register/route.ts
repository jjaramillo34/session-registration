import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Crawl from '@/models/Crawl';
import CrawlRegistration from '@/models/CrawlRegistration';
import mongoose from 'mongoose';
import { toTitleCase } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    // Registration opens at 13:00 PM today (server local time; set TZ for NYC if needed)
    const now = new Date();
    const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0);
    if (now < todayNoon) {
      return NextResponse.json(
        { message: 'Crawl registration opens at 13:00 PM today. Please try again then.' },
        { status: 403 }
      );
    }

    await connectDB();
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

    // Convert crawlId to ObjectId if it's a string
    const crawlObjectId = mongoose.Types.ObjectId.isValid(crawlId) 
      ? new mongoose.Types.ObjectId(crawlId) 
      : crawlId;

    // Get the crawl
    const crawl = await Crawl.findById(crawlObjectId);

    if (!crawl) {
      return NextResponse.json(
        { message: 'Crawl not found' },
        { status: 404 }
      );
    }

    // Check if crawl is full
    const registrationCount = await CrawlRegistration.countDocuments({
      crawlId: crawlObjectId,
      status: 'CONFIRMED'
    });

    if (registrationCount >= crawl.capacity) {
      return NextResponse.json(
        { message: 'This crawl is at full capacity' },
        { status: 400 }
      );
    }

    // Normalize data: title case for name, lowercase for email
    const normalizedName = toTitleCase(name.trim());
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is already registered for this crawl (using normalized email)
    const existingRegistration = await CrawlRegistration.findOne({
      email: normalizedEmail,
      crawlId: crawlObjectId,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this crawl' },
        { status: 400 }
      );
    }

    // Create the registration
    const registration = await CrawlRegistration.create({
      name: normalizedName,
      email: normalizedEmail,
      crawlId: crawlObjectId,
    });

    // Populate crawl
    await registration.populate('crawlId');

    // Update crawl availability if at capacity
    if (registrationCount + 1 >= crawl.capacity) {
      await Crawl.findByIdAndUpdate(crawlObjectId, { available: false });
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