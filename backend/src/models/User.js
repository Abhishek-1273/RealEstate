import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String, default: '' },
  ip: { type: String, default: '' },
});

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
    password: {
      type: String,
      select: false,
    },

    // ── Role-based access ──────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ['client', 'agent', 'management', 'admin'],
      default: 'client',
    },

    // ── Employee-specific ──────────────────────────────────────────────────────
    isActive:   { type: Boolean, default: true },
    department: { type: String, default: '' },   // Sales, Rentals, Management…
    expertise:  { type: String, default: '' },   // Localities they specialize in, e.g. "Koregaon Park"
    qualities:  { type: String, default: '' },   // Agent qualities / special tags, e.g. "Luxury specialist, Great negotiator"
    avatar:     { type: String, default: '' },   // initials fallback on frontend

    // ── Security & Refresh Tokens ──────────────────────────────────────────────
    refreshTokens: {
      type: [refreshTokenSchema],
      select: false,
      default: [],
    },
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },

    // ── User Wishlist ──────────────────────────────────────────────────────────
    wishlist:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ email: 1 });

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is currently locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

const User = mongoose.model('User', userSchema);
export default User;

