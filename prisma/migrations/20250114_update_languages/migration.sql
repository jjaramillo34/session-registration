-- Step 1: Create a temporary column
ALTER TABLE "Registration" ADD COLUMN "temp_language" TEXT;

-- Step 2: Copy data to temporary column
UPDATE "Registration" SET "temp_language" = "language"::TEXT;

-- Step 3: Drop the existing enum and column
ALTER TABLE "Registration" DROP COLUMN "language";
DROP TYPE IF EXISTS "Language";

-- Step 4: Create new enum
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

-- Step 5: Add new column with updated enum
ALTER TABLE "Registration" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'ENGLISH';

-- Step 6: Migrate data with mapping
UPDATE "Registration" 
SET "language" = CASE "temp_language"
  WHEN 'CHINESE_SIMPLIFIED' THEN 'CHINESE_MANDARIN'
  WHEN 'CHINESE_TRADITIONAL' THEN 'CHINESE_CANTONESE'
  WHEN 'BENGALI' THEN 'BANGLA'
  ELSE "temp_language"::"Language"
END;

-- Step 7: Drop temporary column
ALTER TABLE "Registration" DROP COLUMN "temp_language"; 