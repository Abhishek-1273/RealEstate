import MasterData from '../models/MasterData.js';

// ── GET /api/master-data (Public: Grouped by Category) ────────────────────────
export const getMasterData = async (req, res) => {
  try {
    const items = await MasterData.find({ isActive: true }).select('category value');
    
    const grouped = {
      locality: [],
      city: [],
      amenity: [],
      propertyType: []
    };

    items.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item.value);
      }
    });

    // Sort lists alphabetically for clean UI display
    Object.keys(grouped).forEach(k => {
      grouped[k].sort((a, b) => a.localeCompare(b));
    });

    return res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    return res.status(550).json({ success: false, message: error.message });
  }
};

// ── GET /api/master-data/list (Admin: Flat list of all documents) ─────────────
export const getMasterDataList = async (req, res) => {
  try {
    const items = await MasterData.find({}).sort({ category: 1, value: 1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/master-data (Admin Only: Create new item) ────────────────────────
export const createMasterData = async (req, res) => {
  try {
    const { category, value } = req.body;
    if (!category || !value) {
      return res.status(400).json({ success: false, message: 'Category and value are required' });
    }

    const trimmedVal = value.trim();
    const existing = await MasterData.findOne({ category, value: { $regex: new RegExp(`^${trimmedVal}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This item already exists in this category' });
    }

    const newItem = await MasterData.create({ category, value: trimmedVal });
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/master-data/:id (Admin Only: Update item value) ───────────────────
export const updateMasterData = async (req, res) => {
  try {
    const { value, isActive } = req.body;

    const item = await MasterData.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Master data item not found' });
    }

    if (value !== undefined) {
      const trimmedVal = value.trim();
      const existing = await MasterData.findOne({
        _id: { $ne: req.params.id },
        category: item.category,
        value: { $regex: new RegExp(`^${trimmedVal}$`, 'i') }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This item already exists in this category' });
      }
      item.value = trimmedVal;
    }

    if (isActive !== undefined) {
      item.isActive = Boolean(isActive);
    }

    await item.save();

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/master-data/:id (Admin Only: Delete item) ──────────────────────
export const deleteMasterData = async (req, res) => {
  try {
    const item = await MasterData.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Master data item not found' });
    }
    return res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
