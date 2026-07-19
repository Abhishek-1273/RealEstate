import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Property from '../models/Property.js';

const properties = [
  {
    title: 'KP Grand Penthouse',
    type: 'Penthouse',
    category: 'Luxury Apartments',
    price: 120000000,
    priceLabel: '₹12 Cr',
    location: 'KP, Pune',
    city: 'Pune',
    bedrooms: 5,
    bathrooms: 5,
    area: 4800,
    parking: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    badge: 'Featured',
    badgeColor: 'gold',
    status: 'Ready to Move',
    featured: true,
    amenities: ['Rooftop Deck', 'Smart Home Control', 'Italian Kitchen', 'Private Lounge', 'Valet Parking', 'Concierge Service', 'Jacuzzi', 'Home Theatre'],
    description: "Located in Pune's most prestigious address — Koregaon Park (KP). This penthouse features a private rooftop lounge, customized designer wardrobes, premium wellness spaces, and complete home automation by Crestron.",
    agent: { id: '648f3b20755d9b54c8a5cd10', name: 'Arjun Kapoor', phone: '+91 98765 43210' },
    yearBuilt: 2024,
    furnishing: 'Fully Furnished',
    facing: 'East Facing',
    developer: 'Panchshil Realty',
    rera: 'P52100046789',
    coordinates: { lat: 18.5362, lng: 73.8930 },
    isActive: true
  },
  {
    title: 'Balewadi Premium Villa',
    type: 'Villa',
    category: 'Luxury Villas',
    price: 185000000,
    priceLabel: '₹18.5 Cr',
    location: 'Balewadi, Pune',
    city: 'Pune',
    bedrooms: 5,
    bathrooms: 6,
    area: 7800,
    parking: 4,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    ],
    badge: 'New Launch',
    badgeColor: 'green',
    status: 'Under Construction',
    featured: true,
    amenities: ['Private Lawn', 'Infinity Pool', 'Home Automation', 'Basement Theatre', 'Elevator', 'Gym', 'Staff Quarters', 'EV Charging Spot'],
    description: "A spectacular contemporary villa in Balewadi — one of Pune's fastest-growing premium corridors. Designed by leading architects, this residence combines expansive double-height living areas, a private pool, and curated landscape gardens for ultimate luxury.",
    agent: { id: '648f3b20755d9b54c8a5cd11', name: 'Priya Sharma', phone: '+91 98765 43211' },
    yearBuilt: 2025,
    furnishing: 'Shell Condition',
    facing: 'North-East Facing',
    developer: 'Kolte-Patil Developers',
    rera: 'P52100051234',
    coordinates: { lat: 18.5651, lng: 73.7778 },
    isActive: true
  },
  {
    title: 'Prabhat Road Luxury Duplex',
    type: 'Apartment',
    category: 'Luxury Apartments',
    price: 58000000,
    priceLabel: '₹5.8 Cr',
    location: 'Prabhat Road, Pune',
    city: 'Pune',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b46b83a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b46b83a?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    ],
    badge: 'Trending',
    badgeColor: 'blue',
    status: 'Ready to Move',
    featured: true,
    amenities: ['Private Terrace Garden', 'Clubhouse Access', 'Equipped Gym', 'Yoga Studio', '24/7 Security', 'High-Speed Elevators', 'Rooftop Lounge'],
    description: "An elegant duplex residence on Prabhat Road — one of Pune's most sought-after tree-lined avenues in the heart of the city. Features floor-to-ceiling glass paneling, smart home controls, and a gorgeous landscaped private terrace.",
    agent: { id: '648f3b20755d9b54c8a5cd12', name: 'Rahul Mehta', phone: '+91 98765 43212' },
    yearBuilt: 2023,
    furnishing: 'Semi Furnished',
    facing: 'East Facing',
    developer: 'Rohan Builders',
    rera: 'P52100048765',
    coordinates: { lat: 18.5161, lng: 73.8373 },
    isActive: true
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing properties
    await Property.deleteMany({});
    console.log('🗑️ Existing properties cleared');
    
    // Insert new properties
    await Property.insertMany(properties);
    console.log('✅ Properties seeded successfully');
    
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error.message);
    process.exit(1);
  }
};

seedDB();
