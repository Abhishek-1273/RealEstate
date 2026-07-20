import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  logoIconText: 'HR',
  logoIconImage: '',
  logoTextPrimary: 'Hyper',
  logoTextSecondary: 'Relestix',
  logoSubtitle: 'Luxury Real Estate · Pune',

  heroTagline: "Pune's Premier NRI Property Platform",
  heroTitleLine1: "Pune's Finest",
  heroTitleLine2Highlight: "Luxury Homes",
  heroTitleLine3: "For NRIs",
  heroDescription: "Pune's premier luxury real estate agency, specializing in helping NRI clients find elite properties and handle secure investments entirely remotely.",
  heroVideoUrl: 'https://res.cloudinary.com/dzb2hbq9e/video/upload/q_auto,f_webm/v1783787480/bg2_ijjnna.webm',
  heroMobileImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',

  contactPhone1: '+91 98765 43210',
  contactPhone2: '+91 98765 43211',
  contactEmail1: 'hello@hyperrelestix.in',
  contactEmail2: 'careers@hyperrelestix.in',
  contactAddress: 'Level 12, Panchshil Tech Park, Yerwada, Pune 411006',
  contactOfficeHoursWeekdays: 'Mon–Sat: 9:00 AM – 7:00 PM',
  contactOfficeHoursSunday: 'Sunday: 10:00 AM – 4:00 PM',
  contactWhatsApp: '+91 98765 43210',

  stats: {
    experience: 12,
    propertiesSold: 1500,
    happyClients: 98,
    dealsClosed: 350
  },
  socials: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    twitter: '#'
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        // Merge fetched settings with default settings in case some fields are missing
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings
        });
      }
    } catch (err) {
      console.error('Failed to fetch site settings, using defaults.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const refreshSettings = useCallback(() => {
    return fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SettingsProvider');
  }
  return ctx;
};
