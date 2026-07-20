import { API_URL } from '../config/api';
// ── Enquiry (lead capture) ────────────────────────────────────────────────────
export const submitEnquiry = async (payload) => {
  const res = await fetch(`${API_URL}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');
  return data;
};

// ── Properties ────────────────────────────────────────────────────────────────
/**
 * Fetch properties from the backend.
 * @param {Object} params - Optional filters:
 *   type, city, minPrice, maxPrice, featured, search, sort, page, limit
 */
export const fetchProperties = async (params = {}, options = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v);
  });

  const res = await fetch(`${API_URL}/api/properties?${query.toString()}`, {
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch properties');
  return data; // { success, total, count, page, properties }
};

/**
 * Fetch dynamic property counts grouped by type and locality
 */
export const fetchPropertyCounts = async () => {
  const res = await fetch(`${API_URL}/api/properties/counts`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch counts');
  return data; // { success, typeCounts, localityCounts }
};

/**
 * Fetch a single property by its MongoDB _id.
 */
export const fetchPropertyById = async (id) => {
  const res = await fetch(`${API_URL}/api/properties/${id}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Property not found');
  return data.property;
};

// ── AI Chat completions ───────────────────────────────────────────────────────
export const sendChatMessage = async (messages) => {
  const token = localStorage.getItem('hr_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Chatbot request failed');
  return data.reply;
};

// ── Blogs API ────────────────────────────────────────────────────────────────
export const fetchBlogs = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v);
  });
  const res = await fetch(`${API_URL}/api/blogs?${query.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch blogs');
  return data.blogs;
};

export const fetchBlogBySlug = async (slug) => {
  const res = await fetch(`${API_URL}/api/blogs/${slug}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Article not found');
  return data.blog;
};

// ── Partners ──────────────────────────────────────────────────────────────────
export const fetchPartners = async () => {
  const res = await fetch(`${API_URL}/api/partners`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch partners');
  return data.partners;
};

// ── Master Data ───────────────────────────────────────────────────────────────
export const fetchMasterData = async () => {
  const res = await fetch(`${API_URL}/api/master-data`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch master data');
  return data.data; // returns { locality: [], city: [], amenity: [], propertyType: [] }
};

// ── Advisors ──────────────────────────────────────────────────────────────────
export const fetchAdvisors = async () => {
  const res = await fetch(`${API_URL}/api/advisors`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch advisors');
  return data.advisors;
};

// ── Testimonials ──────────────────────────────────────────────────────────────
export const fetchTestimonials = async () => {
  const res = await fetch(`${API_URL}/api/testimonials`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch testimonials');
  return data.testimonials;
};

// ── FAQs ──────────────────────────────────────────────────────────────────────
export const fetchFaqs = async () => {
  const res = await fetch(`${API_URL}/api/faqs`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch faqs');
  return data.faqs;
};

