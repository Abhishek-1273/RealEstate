import mongoose from 'mongoose';
import MasterData from '../models/MasterData.js';
import { seedDefaultAdvisors } from '../seed/seedAdvisors.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if collection is empty
    const count = await MasterData.countDocuments();
    if (count === 0) {
      console.log('🌱 MasterData collection is empty. Seeding defaults...');
      const seedItems = [];

      const types = ['Villa', 'Apartment', 'Penthouse', 'Farm House', 'Commercial', 'Plot'];
      const cities = ['Pune', 'Mumbai', 'Goa', 'Hyderabad', 'Bengaluru', 'Delhi'];
      const localities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav', 'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi', 'Handewadi', 'Wakad', 'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'];
      const amenities = ['Infinity Pool', 'Swimming Pool', 'Private Elevator', 'Smart Automation', '24/7 Concierge', 'Gym', 'Club House', 'Kids Play Area', 'Lush Gardens', 'High-speed Elevators', 'Power Backup', 'Vastu Compliant', 'Sea View'];

      types.forEach(v => seedItems.push({ category: 'propertyType', value: v }));
      cities.forEach(v => seedItems.push({ category: 'city', value: v }));
      localities.forEach(v => seedItems.push({ category: 'locality', value: v }));
      amenities.forEach(v => seedItems.push({ category: 'amenity', value: v }));

      await MasterData.insertMany(seedItems);
      console.log('✅ Default Master Data seeded successfully!');
    }


    // Auto-seed default advisors if empty
    await seedDefaultAdvisors();
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

