import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  // Logo & Branding settings
  logoIconText: { type: String, default: 'HR' },
  logoIconImage: { type: String, default: '' },
  logoFaviconUrl: { type: String, default: '' },
  logoTextPrimary: { type: String, default: 'Hyper' },
  logoTextSecondary: { type: String, default: 'Relestix' },
  logoSubtitle: { type: String, default: 'Luxury Real Estate · Pune' },
  metaTitleSuffix: { type: String, default: 'Luxury Real Estate Pune | Premium Villas & Penthouses' },
  metaDescription: { type: String, default: 'Premier luxury real estate platform specializing in premium villas, penthouses and apartments in Koregaon Park, Baner, Kharadi, Kalyani Nagar and Wakad.' },
  siteUrl: { type: String, default: '' },


  // Hero settings
  heroTagline: { type: String, default: "Pune's Premier NRI Property Platform" },
  heroTitleLine1: { type: String, default: "Pune's Finest" },
  heroTitleLine2Highlight: { type: String, default: "Luxury Homes" },
  heroTitleLine3: { type: String, default: "For NRIs" },
  heroDescription: { type: String, default: "Pune's premier luxury real estate agency, specializing in helping NRI clients find elite properties and handle secure investments entirely remotely." },
  heroVideoUrl: { type: String, default: 'https://res.cloudinary.com/dzb2hbq9e/video/upload/q_auto,f_webm/v1783787480/bg2_ijjnna.webm' },
  heroMobileImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80' },

  // Contact settings
  contactPhone1: { type: String, default: '+91 98765 43210' },
  contactPhone2: { type: String, default: '+91 98765 43211' },
  contactEmail1: { type: String, default: 'hello@hyperrelestix.in' },
  contactEmail2: { type: String, default: 'careers@hyperrelestix.in' },
  contactAddress: { type: String, default: 'Level 12, Panchshil Tech Park, Yerwada, Pune 411006' },
  contactOfficeHoursWeekdays: { type: String, default: 'Mon–Sat: 9:00 AM – 7:00 PM' },
  contactOfficeHoursSunday: { type: String, default: 'Sunday: 10:00 AM – 4:00 PM' },
  contactWhatsApp: { type: String, default: '+91 98765 43210' },

  // Stats strip settings
  stats: {
    experience: { type: Number, default: 12 },
    propertiesSold: { type: Number, default: 1500 },
    happyClients: { type: Number, default: 98 },
    dealsClosed: { type: Number, default: 350 }
  },

  // Social Links
  socials: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    twitter: { type: String, default: '#' }
  }
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
