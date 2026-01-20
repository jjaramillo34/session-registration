import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Session from '@/models/Session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .lean();

    // Transform to include sessionId as string and ensure all fields are present
    const transformedRegistrations = registrations.map(reg => ({
      _id: reg._id.toString(),
      name: reg.name,
      email: reg.email,
      language: reg.language,
      programName: reg.programName,
      agencyName: reg.agencyName || null,
      isNYCPSStaff: reg.isNYCPSStaff || false,
      status: reg.status,
      sessionId: reg.sessionId ? reg.sessionId.toString() : null,
      emailSent: reg.emailSent || false,
      createdAt: reg.createdAt ? reg.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: reg.updatedAt ? reg.updatedAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(transformedRegistrations);
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 