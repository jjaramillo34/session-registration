// Register path aliases before any imports
import { register } from 'tsconfig-paths';
import { resolve } from 'path';

const baseUrl = resolve(__dirname, '..');
register({
  baseUrl,
  paths: {
    '@/*': ['src/*'],
  },
});

import mongoose from 'mongoose';
import { config } from 'dotenv';
import Session from '../src/models/Session';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Program name mappings
const PROGRAM_MAPPING: Record<string, string> = {
  'Adult Ed': 'Adult Education',
  'ReStart Academy': 'ReSTART Academy',
  'East River Academy & Passages': 'East River Academy & Passages', // Will create separate sessions
  'Co-op Tech & Judith S. Kaye': 'Co-op Tech & Judith S. Kaye', // Will create separate sessions
  'P2G': 'Pathways to Graduation',
  'ALC': 'ALC',
  'LYFE Program': 'LYFE',
  'YABC Programs': 'YABC',
};

// Helper function to parse date
function formatDate(dateStr: string): string {
  // Convert "Monday, March 2, 2026" to "2026-03-02"
  // Remove the day name for better parsing
  const dateWithoutDay = dateStr.replace(/^[^,]+, /, '');
  const date = new Date(dateWithoutDay);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format time
function formatTime(timeStr: string): string {
  // Convert "5:30 PM" to "17:30" or "12:00 PM" to "12:00"
  const [time, period] = timeStr.trim().split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${String(hour24).padStart(2, '0')}:${minutes}`;
}

// Evening Sessions Data - 8 total sessions
const eveningSessions = [
  {
    date: 'Monday, March 2, 2026',
    sessions: [
      { time: '5:30 PM', program: 'Adult Ed' },
      { time: '6:30 PM', program: 'ReStart Academy' },
    ],
  },
  {
    date: 'Tuesday, February 24, 2026',
    sessions: [
      { time: '5:30 PM', program: 'East River Academy & Passages' }, // Split ERA & Passages - take one
      { time: '6:30 PM', program: 'Co-op Tech & Judith S. Kaye' }, // Split COOP and JSK - take one
    ],
  },
  {
    date: 'Wednesday, February 25, 2026',
    sessions: [
      { time: '5:30 PM', program: 'P2G' },
      { time: '6:30 PM', program: 'ALC' },
    ],
  },
  {
    date: 'Thursday, February 26, 2026',
    sessions: [
      { time: '5:30 PM', program: 'LYFE Program' },
      { time: '6:30 PM', program: 'YABC Programs' },
    ],
  },
];

// Daytime Sessions Data - 8 total sessions
const daytimeSessions = [
  {
    date: 'Tuesday, February 24, 2026',
    sessions: [
      { time: '12:00 PM', program: 'ALC' },
      { time: '1:00 PM', program: 'P2G' },
    ],
  },
  {
    date: 'Wednesday, February 25, 2026',
    sessions: [
      { time: '11:00 AM', program: 'Co-op Tech & Judith S. Kaye' }, // Split COOP Tech and JSK - take one
      { time: '12:00 PM', program: 'LYFE Program' },
      { time: '1:00 PM', program: 'East River Academy & Passages' }, // Split ERA & Passages - take one
    ],
  },
  {
    date: 'Thursday, February 26, 2026',
    sessions: [
      { time: '11:00 AM', program: 'ReSTART Academy' },
      { time: '12:00 PM', program: 'Adult Ed' },
      { time: '1:00 PM', program: 'YABC Programs' },
    ],
  },
];

async function seedSessions() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing sessions (optional - comment out if you want to keep existing data)
    await Session.deleteMany({});
    console.log('Cleared existing sessions');

    const sessionsToCreate: any[] = [];

    // Process evening sessions
    for (const day of eveningSessions) {
      const formattedDate = formatDate(day.date);
      
      for (const session of day.sessions) {
        if (session.program) {
          // Keep combined programs as single entries (don't split)
          const programName = PROGRAM_MAPPING[session.program] || session.program;
          sessionsToCreate.push({
            name: 'D79 Staff',
            email: 'd79@schools.nyc.gov',
            programName,
            sessionDate: formattedDate,
            sessionTime: formatTime(session.time),
            sessionType: 'evening',
            capacity: 250,
          });
        }
      }
    }

    // Process daytime sessions
    for (const day of daytimeSessions) {
      const formattedDate = formatDate(day.date);
      
      for (const session of day.sessions) {
        if (session.program && session.time !== 'N/A') {
          // Keep combined programs as single entries (don't split)
          const programName = PROGRAM_MAPPING[session.program] || session.program;
          sessionsToCreate.push({
            name: 'D79 Staff',
            email: 'd79@schools.nyc.gov',
            programName,
            sessionDate: formattedDate,
            sessionTime: formatTime(session.time),
            sessionType: 'daytime',
            capacity: 250,
          });
        }
      }
    }

    // Create all sessions
    const createdSessions = await Session.insertMany(sessionsToCreate);
    console.log(`\n✅ Successfully created ${createdSessions.length} sessions!`);

    // Print summary
    console.log('\n📊 Session Summary:');
    const byType = createdSessions.reduce((acc, session) => {
      acc[session.sessionType] = (acc[session.sessionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log(`   Evening sessions: ${byType.evening || 0}`);
    console.log(`   Daytime sessions: ${byType.daytime || 0}`);

    const byProgram = createdSessions.reduce((acc, session) => {
      acc[session.programName] = (acc[session.programName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📋 Sessions by Program:');
    Object.entries(byProgram)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .forEach(([program, count]) => {
        console.log(`   ${program}: ${count}`);
      });

    await mongoose.disconnect();
    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding sessions:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedSessions();
