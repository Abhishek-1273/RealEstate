/**
 * Recursively sanitizes string inputs to prevent XSS injection.
 * Strips HTML tag brackets and control characters while preserving normal textual input.
 */
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // strip control chars
      .replace(/<[^>]*>/g, '')             // strip HTML/XML tags
      .trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object') {
    const sanitizedObj = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        sanitizedObj[key] = sanitizeValue(val[key]);
      }
    }
    return sanitizedObj;
  }
  return val;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body)  req.body  = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  next();
};
