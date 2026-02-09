import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import { D79_PROGRAMS, PROGRAM_DESCRIPTIONS } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    
    // Get one session for each program to use its _id as the program identifier
    const programs = await Promise.all(
      D79_PROGRAMS.map(async (programName) => {
        const session = await Session.findOne({
          programName: { $regex: new RegExp(`^${programName}$`, 'i') }
        })
          .select('_id programName')
          .lean();

        const info = PROGRAM_DESCRIPTIONS[programName];
        return {
          _id: session?._id ? session._id.toString() : null,
          name: programName,
          description: info?.description ?? undefined,
          website: info?.website ?? undefined,
        };
      })
    );

    // Filter out programs that don't have any sessions yet
    const programsWithSessions = programs.filter(p => p._id !== null);

    return NextResponse.json(programsWithSessions);
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
