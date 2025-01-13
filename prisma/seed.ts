import { PrismaClient } from '@prisma/client'
import { AVAILABLE_DATES, DAYTIME_SLOTS, EVENING_SLOTS, SESSION_CAPACITY } from '../src/lib/constants'

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Clear existing time slots
  await prisma.timeSlot.deleteMany();
  console.log('Cleared existing time slots');

  const slots = [];

  // Create time slots for each date
  for (const date of AVAILABLE_DATES) {
    console.log(`Creating slots for date: ${date}`);
    
    // Create daytime slots
    for (const time of DAYTIME_SLOTS) {
      slots.push({
        date,
        time,
        capacity: SESSION_CAPACITY,
        sessionType: 'daytime',
        available: true
      });
    }

    // Create evening slots
    for (const time of EVENING_SLOTS) {
      slots.push({
        date,
        time,
        capacity: SESSION_CAPACITY,
        sessionType: 'evening',
        available: true
      });
    }
  }

  // Create all slots in a single transaction
  await prisma.timeSlot.createMany({
    data: slots
  });

  const totalSlots = await prisma.timeSlot.count();
  console.log(`Database seeded successfully with ${totalSlots} slots`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 