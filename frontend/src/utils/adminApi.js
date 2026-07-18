import { API_URL } from '../config/api';
const API = API_URL;
const call = async (path, options = {}) => {
  const token = localStorage.getItem('hr_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Enquiries / Leads ─────────────────────────────────────────────────────────
export const getEnquiries   = (params = {}) => call(`/api/enquiry?${new URLSearchParams(params)}`);
export const getEnquiry     = (id)           => call(`/api/enquiry/${id}`);
export const getStats       = ()             => call('/api/enquiry/stats');
export const updateStatus   = (id, status)   => call(`/api/enquiry/${id}/status`, {
  method: 'PATCH', body: JSON.stringify({ status }),
});
export const assignLead     = (id, employeeId, employeeName) => call(`/api/enquiry/${id}/assign`, {
  method: 'PATCH', body: JSON.stringify({ employeeId, employeeName }),
});
export const addFollowUp    = (id, note)     => call(`/api/enquiry/${id}/followup`, {
  method: 'POST', body: JSON.stringify({ note }),
});

// ── Properties ────────────────────────────────────────────────────────────────
export const getProperties    = (params = {}) => call(`/api/properties?${new URLSearchParams(params)}`);
export const getProperty      = (id)           => call(`/api/properties/${id}`);
export const createProperty   = (body)          => call('/api/properties', { method: 'POST', body: JSON.stringify(body) });
export const updateProperty   = (id, body)      => call(`/api/properties/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProperty   = (id)            => call(`/api/properties/${id}`, { method: 'DELETE' });

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers         = (params = {}) => call(`/api/auth/users?${new URLSearchParams(params)}`);
export const createStaff      = (body)          => call('/api/auth/staff', { method: 'POST', body: JSON.stringify(body) });
export const updateUserRole   = (id, body)      => call(`/api/auth/users/${id}/role`, { method: 'PATCH', body: JSON.stringify(body) });

// ── Blogs ─────────────────────────────────────────────────────────────────────
export const createBlogAdmin  = (body)          => call('/api/blogs', { method: 'POST', body: JSON.stringify(body) });
export const updateBlogAdmin  = (id, body)      => call(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteBlogAdmin  = (id)            => call(`/api/blogs/${id}`, { method: 'DELETE' });

// ── File Uploads ──────────────────────────────────────────────────────────────
export const uploadImage      = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('hr_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}/api/upload`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed');
  return data.url;
};

// ── Partners ──────────────────────────────────────────────────────────────────
export const getPartnersAdmin = ()          => call('/api/partners/admin');
export const deleteUser       = (id)          => call(`/api/auth/users/${id}`, { method: 'DELETE' });

export const createPartner    = (body)      => call('/api/partners', { method: 'POST', body: JSON.stringify(body) });
export const updatePartner    = (id, body)  => call(`/api/partners/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deletePartner    = (id)        => call(`/api/partners/${id}`, { method: 'DELETE' });
