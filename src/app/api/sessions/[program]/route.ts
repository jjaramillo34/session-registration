import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { D79_PROGRAMS } from '@/lib/constants';

export async function GET(
  request: Request,
  { params }: { params: { program: string } }
) {
  try {
    // Convert URL-friendly format back to program name
    const programSlug = params.program.toLowerCase();
    let programName = '';

    // Handle special cases and acronyms
    const programMapping: Record<string, string> = {
      'co_op_tech': 'Co-op Tech',
      'pathways_to_graduation': 'Pathways to Graduation',
      'yabc': 'YABC',
      'lyfe': 'LYFE',
      'alc': 'ALC',
      'restart_academy': 'ReSTART Academy',
      'east_river_academy': 'East River Academy',
      'passages': 'Passages',
      'adult_education': 'Adult Education',
      'judith_s_kaye': 'Judith S. Kaye High School',
      'other': 'Other'
    };

    // Get program name from mapping or convert from slug
    programName = programMapping[programSlug] || programSlug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Verify it's a valid program name
    if (!D79_PROGRAMS.includes(programName as any)) {
      return NextResponse.json(
        { message: `Invalid program name: ${programName}` },
        { status: 400 }
      );
    }

    // Fetch sessions for the program
    const sessions = await prisma.session.findMany({
      where: {
        programName: {
          equals: programName,
          mode: 'insensitive'
        }
      },
      orderBy: [
        { sessionDate: 'asc' },
        { sessionTime: 'asc' }
      ]
    });

    console.log(`Found ${sessions.length} sessions for program: ${programName}`);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 