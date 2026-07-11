import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

// ── Helper: sign a JWT and set it as httpOnly cookie ──────────────────────────
const setTokenCookie = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

  res.cookie('hr_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// ── Shared user shape returned in every response ──────────────────────────────
const userPayload = (user) => ({
  id:         user._id,
  name:       user.name,
  phone:      user.phone,
  email:      user.email,
  role:       user.role,
  department: user.department,
  isActive:   user.isActive,
  createdAt:  user.createdAt,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signin
// ─────────────────────────────────────────────────────────────────────────────
export const signIn = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian mobile number' });
    }

    let user = await User.findOne({ phone });
    let isNew = false;

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }
      user.name = name;
      if (email) user.email = email;
      await user.save();
    } else {
      user = await User.create({ name, phone, email: email || '', role: 'client' });
      isNew = true;
    }

    setTokenCookie(res, user._id);

    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Account created successfully!' : 'Welcome back!',
      isNew,
      user: userPayload(user),
    });
  } catch (error) {
    console.error('SignIn error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/send
// ─────────────────────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { target, mode } = req.body; // target is email or phone, mode is 'login' or 'signup'
    if (!target) {
      return res.status(400).json({ success: false, message: 'Email or Mobile Number is required' });
    }

    const isEmail = target.includes('@');
    if (isEmail) {
      if (!/\S+@\S+\.\S+/.test(target)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
    } else {
      if (!/^[6-9]\d{9}$/.test(target)) {
        return res.status(400).json({ success: false, message: 'Invalid 10-digit Indian mobile number' });
      }
    }

    // Check database
    const user = await User.findOne({ $or: [{ phone: target }, { email: target }] });

    if (mode === 'login') {
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account registered with this number/email. Please sign up!' });
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }
    } else if (mode === 'signup') {
      if (user) {
        return res.status(400).json({ success: false, message: 'An account with this number/email already exists. Please login instead!' });
      }
    }

    // Generate 6-digit random code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upsert OTP
    await Otp.findOneAndUpdate(
      { target },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    // Log OTP to console in development only (never in production)
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[DEV-ONLY OTP] Target: ${target} | Code: ${code} | Expires: ${expiresAt.toLocaleTimeString()}`);
    }

    return res.status(200).json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('sendOtp error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/otp/verify
// ─────────────────────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { target, code, mode, name, phone, email } = req.body;
    if (!target || !code) {
      return res.status(400).json({ success: false, message: 'Target and OTP code are required' });
    }

    const otpRecord = await Otp.findOne({ target, code });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Delete OTP after verification success
    await Otp.deleteOne({ _id: otpRecord._id });

    let user;
    let isNew = false;

    if (mode === 'signup') {
      if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Name and Mobile Number are required for signup' });
      }
      if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid 10-digit Indian mobile number' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ phone }, { email: email || 'random_non_matching_placeholder' }] });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Create new user
      user = await User.create({
        name,
        phone,
        email: email || '',
        role: 'client',
      });
      isNew = true;
    } else {
      // Login flow
      user = await User.findOne({ $or: [{ phone: target }, { email: target }] });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found. Please sign up!' });
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account deactivated.' });
      }
    }

    // Set cookie session
    setTokenCookie(res, user._id);

    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Account created successfully!' : 'Welcome back!',
      isNew,
      user: userPayload(user),
    });
  } catch (error) {
    console.error('verifyOtp error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me — uses protect middleware; no duplicated JWT decoding here
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.user is populated by the protect middleware
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    return res.status(200).json({ success: true, user: userPayload(req.user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signout
// ─────────────────────────────────────────────────────────────────────────────
export const signOut = async (req, res) => {
  res.clearCookie('hr_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.status(200).json({ success: true, message: 'Signed out successfully' });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/user/:phone
// ─────────────────────────────────────────────────────────────────────────────
export const getUserByPhone = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user: userPayload(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/users  — admin: all users
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    const mapped = users.map(userPayload);
    return res.status(200).json({ success: true, count: users.length, users: mapped });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/staff  — admin: create internal user (employee/lead_control etc)
// ─────────────────────────────────────────────────────────────────────────────
export const createStaff = async (req, res) => {
  try {
    const { name, phone, email, role, department } = req.body;
    if (!name || !phone || !role) {
      return res.status(400).json({ success: false, message: 'name, phone and role are required' });
    }
    const allowed = ['management', 'admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const existing = await User.findOne({ phone });
    if (existing) {
      // Upgrade existing client to staff role
      existing.role = role;
      if (department) existing.department = department;
      if (name)  existing.name  = name;
      if (email) existing.email = email;
      await existing.save();
      return res.status(200).json({ success: true, message: 'User role updated', user: userPayload(existing) });
    }
    const user = await User.create({ name, phone, email: email || '', role, department: department || '' });
    return res.status(201).json({ success: true, message: 'Staff member created', user: userPayload(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/auth/users/:id/role  — admin: change user role
// ─────────────────────────────────────────────────────────────────────────────
export const updateUserRole = async (req, res) => {
  try {
    const { role, department, isActive } = req.body;
    const update = {};
    if (role !== undefined) {
      const allowed = ['client', 'management', 'admin'];
      if (!allowed.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      update.role = role;
    }
    if (department !== undefined) update.department = department;
    if (isActive   !== undefined) update.isActive   = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user: userPayload(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── User Wishlist Sync ────────────────────────────────────────────────────────
// POST /api/auth/wishlist/toggle
export const toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const index = user.wishlist.indexOf(propertyId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(propertyId);
    }
    await user.save();
    const populated = await User.findById(req.user.id).populate('wishlist');
    return res.status(200).json({ success: true, wishlist: populated.wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/social
export const socialSignIn = async (req, res) => {
  try {
    const { name, email, provider } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required for social login' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    let isNew = false;

    if (!user) {
      // Generate a unique collision-resistant placeholder phone (social users have no phone)
      let phone;
      let isPhoneUnique = false;
      while (!isPhoneUnique) {
        const rand = parseInt(crypto.randomBytes(4).toString('hex'), 16) % 9000000;
        phone = `555${String(1000000 + rand).slice(0, 7)}`;
        const existingPhone = await User.findOne({ phone });
        if (!existingPhone) isPhoneUnique = true;
      }

      user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        role: 'client',
      });
      isNew = true;
    } else {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
      }
    }

    // Set cookie
    setTokenCookie(res, user._id);

    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? `Welcome, ${name}! Registered via ${provider}.` : 'Welcome back!',
      isNew,
      user: userPayload(user),
    });
  } catch (error) {
    console.error('socialSignIn error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong during social login.' });
  }
};

// POST /api/auth/google/callback
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    // Google client credentials MUST be set in environment variables — no hardcoded fallbacks
    const client_id     = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri  = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback';

    if (!client_id || !client_secret) {
      return res.status(503).json({ success: false, message: 'Google OAuth is not configured on this server.' });
    }

    // 1. Exchange auth code for access token
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const exchangeResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await exchangeResponse.json();

    if (!exchangeResponse.ok || !tokens.access_token) {
      console.error('Google OAuth Token Exchange Error:', tokens);
      return res.status(400).json({ success: false, message: tokens.error_description || 'OAuth token exchange failed.' });
    }

    // 2. Fetch user profile from Google
    const profileUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await profileResponse.json();
    if (!profileResponse.ok || !googleUser.email) {
      console.error('Google Userinfo Fetch Error:', googleUser);
      return res.status(400).json({ success: false, message: 'Failed to retrieve Google user profile.' });
    }

    // 3. Register or sign in the user
    const email = googleUser.email.toLowerCase();
    const name = googleUser.name || googleUser.given_name || 'Google User';

    let user = await User.findOne({ email });
    let isNew = false;

    if (!user) {
      // Generate a unique collision-resistant placeholder phone (Google users have no phone)
      let phone;
      let isPhoneUnique = false;
      while (!isPhoneUnique) {
        const rand = parseInt(crypto.randomBytes(4).toString('hex'), 16) % 9000000;
        phone = `555${String(1000000 + rand).slice(0, 7)}`;
        const existingPhone = await User.findOne({ phone });
        if (!existingPhone) isPhoneUnique = true;
      }

      user = await User.create({
        name,
        email,
        phone,
        role: 'client',
      });
      isNew = true;
    } else {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }
    }

    // Set cookie
    setTokenCookie(res, user._id);

    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Successfully registered with Google!' : 'Welcome back!',
      isNew,
      user: userPayload(user),
    });

  } catch (error) {
    console.error('googleCallback error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong during Google login.' });
  }
};
