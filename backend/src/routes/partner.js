import express from 'express';
import Partner from '../models/Partner.js';
import { staffOnly } from '../middleware/auth.js';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache.js';

const PARTNERS_CACHE_KEY = 'partners:public';
const PARTNERS_ADMIN_CACHE_KEY = 'partners:admin';

const router = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────
// GET /api/partners - get all visible partners
router.get('/', async (req, res) => {
  try {
    const cached = await cacheGet(PARTNERS_CACHE_KEY);
    if (cached) return res.json({ ...cached, cached: true });

    const partners = await Partner.find({ visible: true }).sort({ name: 1 });
    const result = { success: true, partners };
    await cacheSet(PARTNERS_CACHE_KEY, result, 15 * 60); // 15 min
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin Routes ─────────────────────────────────────────────────────────────
// GET /api/partners/admin - get all partners (including hidden ones)
// FIX: staffOnly is an array [protect, requireRole(...)], must spread with ...staffOnly
router.get('/admin', ...staffOnly, async (req, res) => {
  try {
    const cached = await cacheGet(PARTNERS_ADMIN_CACHE_KEY);
    if (cached) return res.json({ ...cached, cached: true });

    const partners = await Partner.find({}).sort({ name: 1 });
    const result = { success: true, partners };
    await cacheSet(PARTNERS_ADMIN_CACHE_KEY, result, 15 * 60); // 15 min
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/partners - add a partner
router.post('/', ...staffOnly, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Partner name is required' });
    }
    const partner = await Partner.create({ name: name.trim() });
    await cacheDel(PARTNERS_CACHE_KEY, PARTNERS_ADMIN_CACHE_KEY);
    res.json({ success: true, partner });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Partner already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/partners/:id - toggle visibility or update name
router.put('/:id', ...staffOnly, async (req, res) => {
  try {
    const { name, visible } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (visible !== undefined) updateData.visible = visible;

    const partner = await Partner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    await cacheDel(PARTNERS_CACHE_KEY, PARTNERS_ADMIN_CACHE_KEY);
    res.json({ success: true, partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/partners/:id - delete a partner
router.delete('/:id', ...staffOnly, async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    await cacheDel(PARTNERS_CACHE_KEY, PARTNERS_ADMIN_CACHE_KEY);
    res.json({ success: true, message: 'Partner deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
