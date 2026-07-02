import User from '../models/User.js';

// POST /api/auth/signin
// Save user if not exists, return user data
export const signIn = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required',
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number',
      });
    }

    // Check if user already exists by phone
    let user = await User.findOne({ phone });

    if (user) {
      // User exists — update name/email if changed
      user.name = name;
      if (email) user.email = email;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Welcome back!',
        isNew: false,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    }

    // New user — create
    user = await User.create({ name, phone, email: email || '' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      isNew: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('SignIn error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

// GET /api/auth/user/:phone
// Get user by phone
export const getUserByPhone = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/users  (admin - see all users)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
