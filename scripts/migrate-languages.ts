import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_TO_NEW_LANGUAGE_MAPPING = {
  'CHINESE_SIMPLIFIED': 'CHINESE_MANDARIN',
  'CHINESE_TRADITIONAL': 'CHINESE_CANTONESE',
  'BENGALI': 'BANGLA'
};

async function migrateLanguages() {
  try {
    console.log('Starting language migration...');

    // First, alter the type to allow temporary string values
    await prisma.$executeRaw`ALTER TABLE "Registration" ALTER COLUMN "language" TYPE TEXT`;

    // Update the values
    for (const [oldLang, newLang] of Object.entries(OLD_TO_NEW_LANGUAGE_MAPPING)) {
      const result = await prisma.$executeRaw`
        UPDATE "Registration" 
        SET "language" = ${newLang}
        WHERE "language" = ${oldLang}
      `;
      console.log(`Updated registrations from ${oldLang} to ${newLang}`);
    }

    // Recreate the enum type with new values
    await prisma.$executeRaw`
      DROP TYPE IF EXISTS "Language";
      CREATE TYPE "Language" AS ENUM (
        'ASL',
        'ARABIC',
        'BANGLA',
        'CHINESE_MANDARIN',
        'CHINESE_CANTONESE',
        'ENGLISH',
        'FRENCH',
        'HAITIAN_CREOLE',
        'KOREAN',
        'RUSSIAN',
        'SPANISH',
        'URDU'
      );
    `;

    // Convert the column back to enum
    await prisma.$executeRaw`
      ALTER TABLE "Registration" 
      ALTER COLUMN "language" TYPE "Language" 
      USING "language"::"Language"
    `;

    console.log('Language migration completed successfully');
  } catch (error) {
    console.error('Error during language migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateLanguages(); 