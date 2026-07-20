import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../../contexts';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
const SITE_URL = 'https://www.hyperrelestix.in';

/**
 * Reusable SEO component — inject into every page for unique meta tags.
 *
 * @param {string} title        - Page title (appended with " | BrandName")
 * @param {string} description  - Page-specific meta description (max 160 chars)
 * @param {string} image        - OG image URL
 * @param {string} url          - Canonical URL for this page (e.g. /properties/abc)
 * @param {string} type         - OG type (default: 'website', use 'article' for blogs)
 * @param {Object} schema       - Optional JSON-LD structured data object
 */
export default function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  schema = null,
}) {
  const { settings } = useSiteSettings();

  const brandName = settings
    ? `${settings.logoTextPrimary || 'Hyper'}${settings.logoTextSecondary || 'Relestix'}`
    : 'HyperRelestix';

  const defaultDesc = settings
    ? `${brandName} is Pune's most trusted luxury real estate platform. Discover premium villas, penthouses and apartments in Koregaon Park, Baner, Kharadi, Kalyani Nagar, Wakad and Balewadi. RERA verified listings.`
    : "HyperRelestix is Pune's most trusted luxury real estate platform. Discover premium villas, penthouses and apartments in Koregaon Park, Baner, Kharadi, Kalyani Nagar, Wakad and Balewadi. RERA verified listings.";

  const defaultTitle = settings
    ? `${brandName} — Luxury Real Estate Pune | Premium Villas, Apartments & Penthouses`
    : 'HyperRelestix — Luxury Real Estate Pune | Premium Villas, Apartments & Penthouses';

  const activeDesc = description || defaultDesc;
  const fullTitle = title ? `${title} | ${brandName}` : defaultTitle;
  const canonical = `${SITE_URL}${url}`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={activeDesc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={brandName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={activeDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={activeDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data (optional) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

