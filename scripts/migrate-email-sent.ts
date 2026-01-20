/**
 * Migration script to add emailSent field to existing registrations
 * Run this once to update all existing registrations that don't have the emailSent field
 * 
 * Usage: npm run migrate:email-sent
 * Or: ts-node scripts/migrate-email-sent.ts
 */

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

import { config } from 'dotenv';
import mongoose from 'mongoose';
import Registration from '../src/models/Registration';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function migrateEmailSent() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Find all registrations that don't have the emailSent field
    const registrationsWithoutField = await Registration.find({
      emailSent: { $exists: false }
    });

    console.log(`Found ${registrationsWithoutField.length} registrations without emailSent field`);

    if (registrationsWithoutField.length === 0) {
      console.log('No registrations need updating. Migration complete!');
      await mongoose.disconnect();
      return;
    }

    // Update all registrations without emailSent to set it to false
    const result = await Registration.updateMany(
      { emailSent: { $exists: false } },
      { $set: { emailSent: false } }
    );

    console.log(`Successfully updated ${result.modifiedCount} registrations`);
    console.log('Migration complete!');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateEmailSent();
