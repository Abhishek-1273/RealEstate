import mongoose from 'mongoose';

const advisorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    default: 0,
  },
  propertiesSold: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  },
  specialization: {
    type: [String],
    default: [],
  },
  socials: {
    linkedin: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Advisor = mongoose.model('Advisor', advisorSchema);
export default Advisor;
