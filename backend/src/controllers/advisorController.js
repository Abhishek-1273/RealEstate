import Advisor from '../models/Advisor.js';

// ── GET /api/advisors (Public/Staff: List Advisors) ────────────────────────
export const getAdvisors = async (req, res) => {
  try {
    // If request contains authorization or is staff, return all. Otherwise only active.
    // However, to keep it simple, we can filter by isActive for non-admin requests or check query param
    const { all } = req.query;
    const filter = {};
    
    // Default to only active advisors for public
    if (all !== 'true') {
      filter.isActive = true;
    }

    const advisors = await Advisor.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: advisors.length, advisors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/advisors (Admin/Management Only: Create Advisor) ─────────────
export const createAdvisor = async (req, res) => {
  try {
    const {
      name, role, experience, propertiesSold, rating, reviews,
      phone, email, image, specialization, socials, isActive
    } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and Role are required' });
    }

    const newAdvisor = await Advisor.create({
      name,
      role,
      experience: experience || 0,
      propertiesSold: propertiesSold || 0,
      rating: rating || 5.0,
      reviews: reviews || 0,
      phone,
      email,
      image,
      specialization: Array.isArray(specialization) ? specialization : [],
      socials: socials || { linkedin: '#', instagram: '#', twitter: '#' },
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({ success: true, message: 'Advisor created successfully', advisor: newAdvisor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/advisors/:id (Admin/Management Only: Update Advisor) ───────────
export const updateAdvisor = async (req, res) => {
  try {
    const { id } = req.params;
    const advisor = await Advisor.findById(id);

    if (!advisor) {
      return res.status(404).json({ success: false, message: 'Advisor not found' });
    }

    const fieldsToUpdate = [
      'name', 'role', 'experience', 'propertiesSold', 'rating', 'reviews',
      'phone', 'email', 'image', 'specialization', 'socials', 'isActive'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        advisor[field] = req.body[field];
      }
    });

    await advisor.save();
    return res.status(200).json({ success: true, message: 'Advisor updated successfully', advisor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/advisors/:id (Admin/Management Only: Delete Advisor) ────────
export const deleteAdvisor = async (req, res) => {
  try {
    const { id } = req.params;
    const advisor = await Advisor.findByIdAndDelete(id);

    if (!advisor) {
      return res.status(404).json({ success: false, message: 'Advisor not found' });
    }

    return res.status(200).json({ success: true, message: 'Advisor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
