-- Update RegistrationStatus enum
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- Convert existing statuses
ALTER TABLE "Registration" 
  ALTER COLUMN status TYPE "RegistrationStatus" 
  USING CASE 
    WHEN status::text = 'PENDING' THEN 'CONFIRMED'::text
    WHEN status::text = 'WAITLISTED' THEN 'CONFIRMED'::text
    ELSE status::text
  END::"RegistrationStatus";

-- Drop old enum
DROP TYPE "RegistrationStatus_old";

-- Set default value for status
ALTER TABLE "Registration" ALTER COLUMN status SET DEFAULT 'CONFIRMED'; 