import FAQ from '../models/FAQ.js';

// ── GET /api/faqs (Public: List Active FAQs) ──────────────────────────────────
export const getFaqs = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    
    // Default to active only for public
    if (all !== 'true') {
      filter.isActive = true;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/faqs (Admin Only: Create FAQ) ────────────────────────────────────
export const createFaq = async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const newFaq = await FAQ.create({
      question,
      answer,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({ success: true, message: 'FAQ created successfully', faq: newFaq });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/faqs/:id (Admin Only: Update FAQ) ──────────────────────────────────
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, message: 'FAQ updated successfully', faq: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/faqs/:id (Admin Only: Delete FAQ) ────────────────────────────────
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    await faq.deleteOne();
    return res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
