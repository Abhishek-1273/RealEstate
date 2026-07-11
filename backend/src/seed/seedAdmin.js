/**
 * Seed: Create First Admin User
 * Run: node src/seed/seedAdmin.js
 *
 * Creates the first admin account if none exists.
 * Edit ADMIN below before running.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

import User from '../models/User.js';

const ADMIN = {
  name:       'Admin User',
  phone:      '9999999999',   // ← change this to your actual phone
  email:      'admin@hyperrelestix.com',
  role:       'admin',
  department: 'Management',
};

const DEMO_STAFF = [
  { name: 'Management User', phone: '9999999998', role: 'management',   department: 'Management' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clean up old roles if they exist
    const deleteResult = await User.deleteMany({ role: { $in: ['employee', 'lead_control'] } });
    if (deleteResult.deletedCount > 0) {
      console.log(`🧹 Deleted ${deleteResult.deletedCount} leftover employee & lead_control accounts`);
    }

    // Admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${existingAdmin.name} (${existingAdmin.phone})`);
    } else {
      const admin = await User.create(ADMIN);
      console.log(`🔑 Admin created: ${admin.name} | Phone: ${admin.phone}`);
    }

    // Demo staff (safe to re-run — upserts by phone)
    for (const staff of DEMO_STAFF) {
      await User.findOneAndUpdate(
        { phone: staff.phone },
        staff,
        { upsert: true, new: true }
      );
      console.log(`👤 Staff ensured: ${staff.name} (${staff.role})`);
    }

    console.log('\n✅ Done! Sign in at /admin/login with any of these phone numbers.');
    console.log('   Admin:        9999999999');
    console.log('   Management:   9999999998');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

seed();
