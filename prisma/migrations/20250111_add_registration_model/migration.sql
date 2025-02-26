-- First check if the enum type already exists
DO $$ BEGIN
    CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Registration table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Registration" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "schoolDBN" TEXT,
    "role" TEXT,
    "programName" TEXT NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "isNYCPSStaff" BOOLEAN NOT NULL DEFAULT false,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- Create indices if they don't exist
CREATE INDEX IF NOT EXISTS "Registration_email_idx" ON "Registration"("email");
CREATE INDEX IF NOT EXISTS "Registration_timeSlotId_idx" ON "Registration"("timeSlotId");
CREATE INDEX IF NOT EXISTS "Registration_programName_idx" ON "Registration"("programName");
CREATE INDEX IF NOT EXISTS "Registration_status_idx" ON "Registration"("status");

-- Add foreign key if it doesn't exist
DO $$ BEGIN
    ALTER TABLE "Registration" ADD CONSTRAINT "Registration_timeSlotId_fkey" 
    FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$; 