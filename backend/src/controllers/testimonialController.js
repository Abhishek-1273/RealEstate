import Testimonial from '../models/Testimonial.js';

// ── GET /api/testimonials (Public: List Active Testimonials) ────────────────
export const getTestimonials = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    
    // Default to active only for public
    if (all !== 'true') {
      filter.isActive = true;
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/testimonials (Admin Only: Create Testimonial) ──────────────────
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, image, rating, text, property, isActive } = req.body;

    if (!name || !role || !text) {
      return res.status(400).json({ success: false, message: 'Name, role and review text are required' });
    }

    const newTestimonial = await Testimonial.create({
      name,
      role,
      image,
      rating: rating || 5,
      text,
      property,
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({ success: true, message: 'Testimonial created successfully', testimonial: newTestimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/testimonials/:id (Admin Only: Update Testimonial) ────────────────
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: 'Testimonial updated successfully', testimonial: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/testimonials/:id (Admin Only: Delete Testimonial) ──────────────
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
