import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  logoIconText: 'HR',
  logoIconImage: '',
  logoFaviconUrl: '',
  logoTextPrimary: 'Hyper',
  logoTextSecondary: 'Relestix',
  logoSubtitle: 'Luxury Real Estate · Pune',
  metaTitleSuffix: 'Luxury Real Estate Pune | Premium Villas & Penthouses',
  metaDescription: 'Premier luxury real estate platform specializing in premium villas, penthouses and apartments in Koregaon Park, Baner, Kharadi, Kalyani Nagar and Wakad.',

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

export function getLogoInitials(settings) {
  if (settings?.logoIconText?.trim()) return settings.logoIconText.trim();
  const p = (settings?.logoTextPrimary || 'HR').trim();
  const s = (settings?.logoTextSecondary || '').trim();
  const pChar = p ? p[0].toUpperCase() : '';
  const sChar = s ? s[0].toUpperCase() : '';
  return `${pChar}${sChar}` || 'HR';
}

export function getBrandName(settings) {
  if (!settings) return 'HyperRelestix';
  const p = settings.logoTextPrimary !== undefined ? settings.logoTextPrimary : 'Hyper';
  const s = settings.logoTextSecondary !== undefined ? settings.logoTextSecondary : 'Relestix';
  if (!p && !s) return 'HyperRelestix';
  if (!p) return s;
  if (!s) return p;
  const needsSpace = !p.endsWith(' ') && !s.startsWith(' ');
  return `${p}${needsSpace ? ' ' : ''}${s}`;
}

export function renderBrandLogo(settings, secondaryColor = '#D4AF37') {
  const p = settings?.logoTextPrimary !== undefined ? settings.logoTextPrimary : 'Hyper';
  const s = settings?.logoTextSecondary !== undefined ? settings.logoTextSecondary : 'Relestix';
  const needsSpace = p && s && !p.endsWith(' ') && !s.startsWith(' ');

  return (
    <>
      <span className="whitespace-pre">{p}</span>
      {s && (
        <span style={{ color: secondaryColor }} className="whitespace-pre">
          {needsSpace ? ' ' : ''}{s}
        </span>
      )}
    </>
  );
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('hr_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // Ignore storage parse errors
    }
    return DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(true);

  // Dynamic Head Updating & Favicon Cache Invalidation
  useEffect(() => {
    if (!settings) return;
    const brandName = getBrandName(settings);
    const suffix = settings.metaTitleSuffix || settings.logoSubtitle || 'Luxury Real Estate';

    // 1. Update Document Title
    document.title = `${brandName} — ${suffix}`;

    // 2. Dynamic Cache-Busted Favicon Update
    const faviconUrl = settings.logoFaviconUrl || settings.logoIconImage;
    if (faviconUrl) {
      let faviconLink = document.querySelector("link[rel~='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(faviconLink);
      }
      // Append cache-busting timestamp/version to ensure instant refresh upon admin change
      const cacheBustUrl = faviconUrl.includes('?') 
        ? `${faviconUrl}&v=${Date.now()}` 
        : `${faviconUrl}?v=${Date.now()}`;
      faviconLink.href = cacheBustUrl;
    }

    // 3. Update Meta Description
    if (settings.metaDescription) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.getElementsByTagName('head')[0].appendChild(metaDesc);
      }
      metaDesc.content = settings.metaDescription;
    }

    // 4. Update Open Graph Site Name & Title
    let ogSiteName = document.querySelector("meta[property='og:site_name']");
    if (ogSiteName) ogSiteName.content = brandName;

    let ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.content = `${brandName} — ${suffix}`;
  }, [settings]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings?_t=${Date.now()}`);
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        const merged = {
          ...DEFAULT_SETTINGS,
          ...data.settings
        };
        setSettings(merged);
        try {
          localStorage.setItem('hr_site_settings', JSON.stringify(merged));
        } catch {
          // Ignore storage quota errors
        }
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
