import SiteSettings from '../models/SiteSettings.js';

// ── GET /api/settings (Public: Fetch Site Settings) ────────────────────────
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create a default settings entry if none exists
      settings = await SiteSettings.create({});
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/settings (Admin/Management Only: Update Site Settings) ──────────
export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    // Update fields from body
    const fieldsToUpdate = [
      'logoIconText', 'logoIconImage', 'logoTextPrimary', 'logoTextSecondary', 'logoSubtitle',
      'heroTagline', 'heroTitleLine1', 'heroTitleLine2Highlight', 'heroTitleLine3', 'heroDescription', 'heroVideoUrl', 'heroMobileImageUrl',
      'contactPhone1', 'contactPhone2', 'contactEmail1', 'contactEmail2', 'contactAddress', 'contactOfficeHoursWeekdays', 'contactOfficeHoursSunday', 'contactWhatsApp'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    if (req.body.stats !== undefined) {
      settings.stats = { ...settings.stats, ...req.body.stats };
    }
    if (req.body.socials !== undefined) {
      settings.socials = { ...settings.socials, ...req.body.socials };
    }

    await settings.save();
    return res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
