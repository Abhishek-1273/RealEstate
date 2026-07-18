/**
 * Generates a dynamic Open Graph (OG) sharing image using Cloudinary's overlay transformations.
 * If the image is not hosted on Cloudinary, it falls back to the original image URL gracefully.
 * 
 * @param {Object} property - The property object containing title, location, priceLabel, and image.
 * @returns {string} The transformed image URL.
 */
export function getDynamicOgImage(property) {
  if (!property) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200';
  
  const mainImage = property.image || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200';
  
  // Check if it is a Cloudinary URL
  if (mainImage.includes('cloudinary.com')) {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>
      const parts = mainImage.split('/upload/');
      if (parts.length === 2) {
        // Prepare overlay texts (must double escape special characters for Cloudinary text overlays)
        const cleanText = (text) => {
          if (!text) return '';
          return encodeURIComponent(
            text
              .replace(/,/g, '%2C')
              .replace(/\//g, '%2F')
              .replace(/\?/g, '%3F')
              .replace(/#/g, '%23')
              .replace(/%/g, '%25')
          );
        };

        const titleText = cleanText(property.title);
        const priceText = cleanText(property.priceLabel || '');
        const locationText = cleanText(property.location || '');
        const cityText = cleanText(property.city || 'Pune');

        // Cloudinary Transformations:
        // - Resize & crop to 1200x630 (standard OG size)
        // - Add a subtle gradient/dark overlay at the bottom for text legibility
        // - Overlay bold text logo "HyperRelestix"
        // - Overlay property title (large white font)
        // - Overlay price and location (smaller gold font)
        const textOverlay = [
          'w_1200,h_630,c_fill,q_auto,f_auto',
          'co_rgb:071a2f,op_65,l_rect,w_1200,h_200,y_215', // bottom banner background
          'co_rgb:ffffff,l_text:Arial_44_bold:HyperRelestix,g_north_west,x_60,y_50', // branding logo top left
          `co_rgb:ffffff,l_text:Arial_38_bold:${titleText},g_south_west,x_60,y_110`, // title bottom left
          `co_rgb:e5c17d,l_text:Arial_26_bold:${priceText}%20-%20${locationText}%2C%20${cityText},g_south_west,x_60,y_55` // details bottom left
        ].join('/');

        return `${parts[0]}/upload/${textOverlay}/${parts[1]}`;
      }
    } catch (err) {
      console.error('Failed to generate Cloudinary dynamic OG image:', err);
    }
  }
  
  return mainImage;
}
