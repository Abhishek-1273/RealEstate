import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    // 1. Seed the ONLY admin (Abhishek Kayg)
    const adminEmail = 'akayg@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      if (!existingAdmin.password) existingAdmin.password = 'Admin@123456';
      await existingAdmin.save();
      console.log('ℹ️ Admin user verified:', existingAdmin.email);
    } else {
      const admin = await User.create({
        name: 'Abhishek Kayg',
        phone: '9999999999',
        email: adminEmail,
        password: 'Admin@123456',
        role: 'admin',
        isActive: true,
        department: 'Management'
      });
      console.log('✅ Admin user created successfully:', admin.email);
    }

    // 2. Seed manager/staff accounts (e.g. admin@hyperrelestix.in -> management)
    const managerEmail = 'admin@hyperrelestix.in';
    const existingManager = await User.findOne({ email: managerEmail });
    if (existingManager) {
      existingManager.role = 'management';
      if (!existingManager.password) existingManager.password = 'Manager@123456';
      await existingManager.save();
      console.log('ℹ️ Manager user verified:', existingManager.email);
    } else {
      const manager = await User.create({
        name: 'Office Manager',
        phone: '8888888888',
        email: managerEmail,
        password: 'Manager@123456',
        role: 'management',
        isActive: true,
        department: 'Management'
      });
      console.log('✅ Manager user created successfully:', manager.email);
    }

    // Check if a demo agent exists
    const agentEmail = 'agent@hyperrelestix.in';
    const existingAgent = await User.findOne({ email: agentEmail });
    if (existingAgent) {
      if (!existingAgent.password) existingAgent.password = 'Agent@123456';
      await existingAgent.save();
      console.log('ℹ️ Demo agent already exists:', existingAgent.email);
    } else {
      const agent = await User.create({
        name: 'Arjun Kapoor',
        phone: '9876543210',
        email: agentEmail,
        password: 'Agent@123456',
        role: 'agent',
        isActive: true,
        department: 'Sales',
        expertise: 'Koregaon Park, KP',
        qualities: 'Luxury specialist, Great negotiator'
      });
      console.log('✅ Demo agent created successfully:', agent.email);
    }

    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin/agent:', error.message);
    process.exit(1);
  }
};

seedAdmin();
