import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const SESSION_DATES = [
  'jan-14-2025',
  'jan-15-2025',
  'jan-16-2025',
  'jan-17-2025'
];

const DAYTIME_SLOTS = [
  '0900',
  '0930',
  '1000',
  '1030',
  '1100',
  '1130',
  '1300',
  '1330',
  '1400',
  '1430',
  '1500',
  '1530'
];

const EVENING_SLOTS = [
  '1700',
  '1730',
  '1800',
  '1830',
  '1900',
  '1930'
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.timeSlot.deleteMany();
  await prisma.session.deleteMany();

  // Create daytime slots
  for (const date of SESSION_DATES) {
    for (const time of DAYTIME_SLOTS) {
      await prisma.timeSlot.create({
        data: {
          date,
          time,
          sessionType: 'daytime',
          capacity: 2,
          available: true
        }
      });
    }
  }

  // Create evening slots
  for (const date of SESSION_DATES) {
    for (const time of EVENING_SLOTS) {
      await prisma.timeSlot.create({
        data: {
          date,
          time,
          sessionType: 'evening',
          capacity: 2,
          available: true
        }
      });
    }
  }

  const totalSlots = await prisma.timeSlot.count();
  console.log(`✅ Database seeded with ${totalSlots} time slots!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 