import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'HyperRelestix';
const DEFAULT_TITLE = 'HyperRelestix — Luxury Real Estate Pune | Premium Villas, Apartments & Penthouses';
const DEFAULT_DESC = "HyperRelestix is Pune's most trusted luxury real estate platform. Discover premium villas, penthouses and apartments in Koregaon Park, Baner, Kharadi, Kalyani Nagar, Wakad and Balewadi. RERA verified listings.";
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
const SITE_URL = 'https://www.hyperrelestix.in';

/**
 * Reusable SEO component — inject into every page for unique meta tags.
 *
 * @param {string} title        - Page title (appended with " | HyperRelestix")
 * @param {string} description  - Page-specific meta description (max 160 chars)
 * @param {string} image        - OG image URL
 * @param {string} url          - Canonical URL for this page (e.g. /properties/abc)
 * @param {string} type         - OG type (default: 'website', use 'article' for blogs)
 * @param {Object} schema       - Optional JSON-LD structured data object
 */
export default function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  schema = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonical = `${SITE_URL}${url}`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
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
