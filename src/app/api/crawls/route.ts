import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Crawl from '@/models/Crawl';
import CrawlRegistration from '@/models/CrawlRegistration';
import { CRAWL_EVENTS, CRAWL_CAPACITY } from '@/lib/crawl-events';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Build the unique doc we use for each event (name is location + programs). */
function eventToDoc(ev: (typeof CRAWL_EVENTS)[0]) {
  const location = ev['Location / School'];
  const programs = ev.Programs;
  const address = ev.Address;
  const date = ev.Date;
  const startTime = ev.StartTime;
  const endTime = ev.EndTime;
  const name = `${location} – ${programs}`;
  const coordinates = [ev.Longitude, ev.Latitude]; // [lng, lat] for Mapbox
  return { name, location, address, date, time: startTime, endTime, borough: ev.Borough, capacity: CRAWL_CAPACITY, available: true, coordinates, description: programs };
}

/** Seed crawl events from CRAWL_EVENTS (15 spots each). Upsert by name+address+date+time so the 18 are always present. */
async function seedCrawls() {
  for (const ev of CRAWL_EVENTS) {
    const doc = eventToDoc(ev);
    const filter = {
      name: doc.name,
      address: doc.address,
      date: doc.date,
      time: doc.time,
    };
    await Crawl.findOneAndUpdate(
      filter,
      { $set: doc },
      { upsert: true, new: true }
    );
  }
}

/** Return only crawls that match our CRAWL_EVENTS (same name+address+date+time). */
async function getSeededCrawls() {
  const orConditions = CRAWL_EVENTS.map((ev) => {
    const doc = eventToDoc(ev);
    return { name: doc.name, address: doc.address, date: doc.date, time: doc.time };
  });
  return Crawl.find({ $or: orConditions })
    .sort({ borough: 1, name: 1 })
    .lean();
}

export async function GET() {
  try {
    await connectDB();
    await seedCrawls();

    // Return only the 18 seeded crawls (including full ones) so UI can show "Fully Booked"
    const crawls = await getSeededCrawls();

    const crawlsWithCounts = await Promise.all(
      crawls.map(async (crawl) => {
        const count = await CrawlRegistration.countDocuments({
          crawlId: crawl._id,
          status: 'CONFIRMED',
        });
        return {
          ...crawl,
          id: crawl._id.toString(),
          _count: {
            registrations: count,
          },
        };
      })
    );

    return NextResponse.json(crawlsWithCounts);
  } catch (error) {
    console.error('Failed to fetch crawls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawls' },
      { status: 500 }
    );
  }
} 