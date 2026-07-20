import Advisor from '../models/Advisor.js';

const defaultAdvisors = [
  {
    name: 'Arjun Kapoor',
    role: 'Senior NRI Property Advisor',
    experience: 14,
    propertiesSold: 380,
    rating: 4.9,
    reviews: 148,
    phone: '+91 98765 43210',
    email: 'arjun@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    specialization: ['KP', 'NRI Investment', 'Luxury Penthouses'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
    isActive: true
  },
  {
    name: 'Priya Sharma',
    role: 'Luxury Property Consultant',
    experience: 10,
    propertiesSold: 245,
    rating: 4.9,
    reviews: 112,
    phone: '+91 98765 43211',
    email: 'priya@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&q=80',
    specialization: ['Baner', 'Balewadi', 'PCMC Villas'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
    isActive: true
  },
  {
    name: 'Rahul Mehta',
    role: 'NRI Investment Specialist',
    experience: 8,
    propertiesSold: 196,
    rating: 4.8,
    reviews: 88,
    phone: '+91 98765 43212',
    email: 'rahul@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    specialization: ['FEMA Compliance', 'Kharadi', 'Hinjewadi Phase I, II'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
    isActive: true
  },
  {
    name: 'Neha Gupta',
    role: 'Villa & Estate Specialist',
    experience: 12,
    propertiesSold: 310,
    rating: 4.9,
    reviews: 130,
    phone: '+91 98765 43213',
    email: 'neha@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
    specialization: ['KP', 'Baner', 'Heritage Estates'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
    isActive: true
  }
];

export const seedDefaultAdvisors = async () => {
  try {
    const count = await Advisor.countDocuments();
    if (count === 0) {
      await Advisor.insertMany(defaultAdvisors);
      console.log('🌱 Dynamic advisors auto-seeded successfully!');
    } else {
      console.log('ℹ️ Advisors collection already has data. Skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error auto-seeding advisors:', error.message);
  }
};
