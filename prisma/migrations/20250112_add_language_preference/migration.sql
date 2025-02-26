-- First check if the enum type already exists
DO $$ BEGIN
    CREATE TYPE "Language" AS ENUM (
        'ENGLISH',
        'SPANISH',
        'CHINESE_SIMPLIFIED',
        'CHINESE_TRADITIONAL',
        'RUSSIAN',
        'BENGALI',
        'HAITIAN_CREOLE',
        'KOREAN',
        'ARABIC',
        'URDU',
        'FRENCH'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add language column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "Registration" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'ENGLISH';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$; 