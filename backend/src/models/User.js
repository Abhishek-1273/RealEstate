import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },

    // ── Role-based access ──────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ['client', 'management', 'admin'],
      default: 'client',
    },

    // ── Employee-specific ──────────────────────────────────────────────────────
    isActive:   { type: Boolean, default: true },
    department: { type: String, default: '' },   // Sales, Rentals, Management…
    avatar:     { type: String, default: '' },   // initials fallback on frontend

    // ── User Wishlist ──────────────────────────────────────────────────────────
    wishlist:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);
export default User;
