import mongoose from 'mongoose';

const masterDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['locality', 'city', 'amenity', 'propertyType'],
    index: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Prevent duplicate master data values per category
masterDataSchema.index({ category: 1, value: 1 }, { unique: true });

const MasterData = mongoose.model('MasterData', masterDataSchema);
export default MasterData;
