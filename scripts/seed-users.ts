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
import User from '../src/models/User';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'password';
if (!DEFAULT_PASSWORD) {
  throw new Error('DEFAULT_PASSWORD environment variable is not set');
}

async function seedUsers() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = [
      {
        name: 'Javier Jaramillo',
        email: 'jjaramillo7@schools.nyc.gov',
        // Delete this line and uncomment the line below to use a secure password
        password: DEFAULT_PASSWORD,
        role: 'admin' as const,
      },
      {
        name: 'Stacey Oliger',
        email: 'SOliger@schools.nyc.gov',
        password: DEFAULT_PASSWORD,
        role: 'admin' as const,
      },
    ];

    console.log(`\n📝 Creating admin users with password: ${DEFAULT_PASSWORD}\n`);

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Create new user (password will be hashed automatically by the model)
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('\n✅ User seeding completed successfully!');
    console.log('\n⚠️  IMPORTANT: Please change the default passwords after first login!');
    console.log(`   Default password: ${DEFAULT_PASSWORD}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedUsers();
