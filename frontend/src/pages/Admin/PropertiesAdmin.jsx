import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Trash2, Loader2, X, Building2, ChevronDown, Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProperties, createProperty, updateProperty, deleteProperty, uploadImage, getUsers } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';
import ImageUploader from '../../components/common/ImageUploader';
import { SkeletonTable } from '../../components/common/Skeleton';

const FormContext = createContext(null);

const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1";

function CustomSelect({ value, onChange, options, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selectedOption = options.find(o => typeof o === 'object' ? o.value === value : o === value);
  const displayText = selectedOption 
    ? (typeof selectedOption === 'object' ? (selectedOption.display || selectedOption.label) : selectedOption) 
    : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 h-11 py-0 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-left transition-colors duration-200 focus:outline-none focus:border-gold/50 ${className}`}
      >
        <span className={value ? "text-navy dark:text-white" : "text-gray-400 dark:text-white/25"}>
          {displayText}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-[#071A2F]/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 py-1.5 no-scrollbar"
          >
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              const active = value === val;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${active
                      ? 'bg-gold/10 text-gold-dark dark:text-gold'
                      : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                    }`}
                >
                  <span>{label}</span>
                  {active && <span className="text-gold text-[10px]">●</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function F({ label, name, type = 'text', options, required }) {
  const { form, set } = useContext(FormContext);
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {options ? (
        <CustomSelect
          value={form[name]}
          onChange={val => set(name, val)}
          placeholder={`Select ${label}`}
          options={options}
        />
      ) : type === 'textarea' ? (
        <textarea value={form[name] || ''} onChange={e => set(name, e.target.value)}
          rows={3} className={`${inputCls} resize-none`} />
      ) : (
        <input type={type} value={form[name] || ''} onChange={e => set(name, e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

const TYPES = ['Villa', 'Apartment', 'Penthouse', 'Farm House', 'Commercial', 'Plot'];
const CITIES = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav', 'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi', 'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar', 'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari', 'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi', 'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'];
const STATUSES = ['Ready to Move', 'Under Construction', 'Pre-Launch', 'Sold Out'];
const FURNISHING = ['Fully Furnished', 'Semi Furnished', 'Shell Condition'];

const EMPTY = {
  title: '', type: 'Villa', city: 'Pune', location: 'Balewadi',
  price: '', priceLabel: '', bedrooms: '', bathrooms: '',
  area: '', parking: '', image: '', images: [], badge: '', badgeColor: 'gold',
  status: 'Ready to Move', furnishing: 'Shell Condition',
  developer: '', rera: '', description: '', featured: false,
  coordinates: { lat: '', lng: '' },
  amenities: [],
};

function AgentOption({ agent, propertyLocation }) {
  const [expanded, setExpanded] = useState(false);
  
  const areas = agent.expertise ? agent.expertise.split(',').map(s => s.trim()) : [];
  const isRecommended = propertyLocation && areas.some(areaStr => 
    areaStr.toLowerCase() === propertyLocation.toLowerCase() || 
    propertyLocation.toLowerCase().includes(areaStr.toLowerCase())
  );
  
  let expertiseText = '';
  let hasMore = false;
  let moreCount = 0;
  
  if (areas.length > 0) {
    if (isRecommended) {
      const match = areas.find(areaStr => 
        areaStr.toLowerCase() === propertyLocation.toLowerCase() || 
        propertyLocation.toLowerCase().includes(areaStr.toLowerCase())
      );
      expertiseText = `⭐ Specialist in ${match}`;
      if (areas.length > 1) {
        hasMore = true;
        moreCount = areas.length - 1;
      }
    } else if (areas.length > 2) {
      hasMore = true;
      moreCount = areas.length - 2;
      expertiseText = expanded ? areas.join(', ') : `${areas.slice(0, 2).join(', ')}`;
    } else {
      expertiseText = areas.join(', ');
    }
  }

  return (
    <div 
      onClick={(e) => {
        if (e.target.closest('.toggle-expand-btn')) {
          e.stopPropagation();
          setExpanded(!expanded);
        }
      }}
      className="flex flex-col items-stretch w-full py-1 text-xs text-left"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="font-bold text-navy dark:text-white truncate">{agent.name}</span>
          {expertiseText && (
            <span className={`text-[9px] font-medium mt-0.5 whitespace-normal break-words leading-relaxed ${isRecommended ? 'text-amber-500 font-extrabold' : 'text-gray-405 dark:text-white/30'}`}>
              {isRecommended && !expanded ? expertiseText : (expanded ? `Areas: ${areas.join(', ')}` : `Specialty: ${expertiseText}`)}
              {hasMore && (
                <button
                  type="button"
                  className="toggle-expand-btn ml-1 px-1.5 py-0.5 rounded bg-gold/10 hover:bg-gold/20 text-gold text-[8px] font-black uppercase transition-colors inline-block focus:outline-none"
                >
                  {expanded ? 'Less' : `+${moreCount} More`}
                </button>
              )}
            </span>
          )}
        </div>
        <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-black uppercase ml-3 ${
          agent.activeLeads > 3 
            ? 'bg-red-500/10 text-red-500 border border-red-500/10' 
            : agent.activeLeads > 0 
            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10' 
            : 'bg-green-500/10 text-green-500 border border-green-500/10'
        }`}>
          {agent.activeLeads || 0} Leads
        </span>
      </div>
    </div>
  );
}

function PropertyForm({ initial, onSave, onClose }) {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY;
    const images = initial.images && initial.images.length > 0
      ? initial.images
      : (initial.image ? [initial.image] : []);
    const coordinates = initial.coordinates || { lat: '', lng: '' };
    const amenities = initial.amenities || [];
    return { ...initial, images, coordinates, amenities };
  });

  useEffect(() => {
    getUsers()
      .then(data => {
        const staff = (data.users || []).filter(u => u.role !== 'client');
        setAgents(staff);
      })
      .catch(err => console.error("Failed to load agents", err));
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [customLocation, setCustomLocation] = useState(() => {
    if (initial && initial.location) {
      return !CITIES.includes(initial.location);
    }
    return false;
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryLoading(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setForm(p => ({
        ...p,
        images: [...(p.images || []), ...urls]
      }));
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.type || !form.price || !form.location || !form.city) {
      setError('Title, type, price, location and city are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const coverImage = form.images && form.images.length > 0 ? form.images[0] : '';
      const cleanAmenities = (form.amenities || [])
        .map(a => typeof a === 'string' ? a.trim() : '')
        .filter(a => a !== '');

      const cleanCoordinates = (form.coordinates?.lat !== '' && form.coordinates?.lng !== '')
        ? { lat: Number(form.coordinates.lat), lng: Number(form.coordinates.lng) }
        : undefined;

      await onSave({
        ...form,
        image: coverImage,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        parking: Number(form.parking),
        amenities: cleanAmenities,
        coordinates: cleanCoordinates
      });
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <FormContext.Provider value={{ form, set }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-transparent dark:border-white/10 transition-colors duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Manrope,sans-serif' }}>
              {initial ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
              <X className="w-4 h-4 text-gray-500 dark:text-white/50" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><F label="Title" name="title" required /></div>
              <F label="Type" name="type" options={TYPES} required />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>
                    Location / Area <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLocation(!customLocation);
                      set('location', ''); // clear previous value on toggle
                    }}
                    className="text-[9px] font-black text-gold hover:text-gold-light uppercase tracking-wider transition-colors cursor-pointer"
                    style={{ color: '#D4AF37' }}
                  >
                    {customLocation ? '← Select List' : '✎ Custom'}
                  </button>
                </div>
                {customLocation ? (
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={e => set('location', e.target.value)}
                    placeholder="e.g. Koregaon Park, Kalyani Nagar..."
                    className={inputCls}
                    required
                  />
                ) : (
                  <CustomSelect
                    value={form.location}
                    onChange={val => set('location', val)}
                    placeholder="Select Location"
                    options={CITIES}
                  />
                )}
              </div>
              <F label="City" name="city" required />
              <F label="Price (₹ in numbers)" name="price" type="number" required />
              <F label="Price Label (₹45 Cr)" name="priceLabel" />
              <F label="Bedrooms" name="bedrooms" type="number" />
              <F label="Bathrooms" name="bathrooms" type="number" />
              <F label="Area (sq ft)" name="area" type="number" />
              <F label="Parking" name="parking" type="number" />
              <F label="Status" name="status" options={STATUSES} />
              <F label="Furnishing" name="furnishing" options={FURNISHING} />
               <F label="Badge Text (Featured, New Launch…)" name="badge" />
              <F label="Developer" name="developer" />
              <F label="RERA Number" name="rera" />

              <div>
                <label className={labelCls}>Assigned Agent</label>
                <CustomSelect
                  value={form.agent?.id || ''}
                  onChange={(val) => {
                    const selectedAgentUser = agents.find(a => a.id === val);
                    set('agent', selectedAgentUser ? {
                      id: selectedAgentUser.id,
                      name: selectedAgentUser.name,
                      phone: selectedAgentUser.phone
                    } : {});
                  }}
                  placeholder="Select Assigned Agent"
                  options={[
                    { value: '', label: 'Unassigned', display: 'Unassigned' },
                    ...agents
                      .filter(u => u.role === 'agent')
                      .map(a => ({
                        value: a.id,
                        label: `${a.name} (${a.email || 'No email'})`,
                        display: a.name
                      }))
                  ]}
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <label className={labelCls}>Property Images Gallery</label>
                <div className="flex flex-wrap gap-3 mt-1.5 p-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.02]">
                  {(form.images || []).map((imgUrl, index) => (
                    <div key={index} className="w-24 h-24 relative rounded-xl overflow-hidden group border border-gray-150 dark:border-white/10 shadow-sm shrink-0">
                      <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== index) }))}
                          className="p-1 bg-red-500 hover:bg-red-650 text-white rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded text-[8px] font-black uppercase bg-gold text-navy tracking-wider scale-[0.85] origin-bottom-left shadow-md">
                          ★ Cover
                        </span>
                      )}
                    </div>
                  ))}

                  <div
                    onClick={() => document.getElementById('gallery-file-input').click()}
                    className="w-24 h-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold dark:hover:border-gold/50 transition-colors text-center bg-white dark:bg-white/5 shrink-0"
                  >
                    <input
                      id="gallery-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                    {galleryLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gold" style={{ color: '#D4AF37' }} />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-gray-400 dark:text-white/30" />
                        <span className="text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mt-0.5">Upload</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-white/35 mt-1.5 leading-normal">
                  Upload multiple images. The first image ("★ Cover") in the list will automatically serve as the property thumbnail and cover image.
                </p>
              </div>
              <div className="sm:col-span-2"><F label="Description" name="description" type="textarea" /></div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Amenities (Comma separated)</label>
                <textarea
                  value={(form.amenities || []).join(', ')}
                  onChange={e => setForm(p => ({
                    ...p,
                    amenities: e.target.value.split(',').map(s => s.trim())
                  }))}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. Infinity Pool, Private Elevator, Smart Automation, 24/7 Concierge"
                />
              </div>
              <div>
                <label className={labelCls}>Map Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lat ?? ''}
                  onChange={e => setForm(p => ({
                    ...p,
                    coordinates: { ...p.coordinates, lat: e.target.value }
                  }))}
                  className={inputCls}
                  placeholder="e.g. 18.5204"
                />
              </div>
              <div>
                <label className={labelCls}>Map Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lng ?? ''}
                  onChange={e => setForm(p => ({
                    ...p,
                    coordinates: { ...p.coordinates, lng: e.target.value }
                  }))}
                  className={inputCls}
                  placeholder="e.g. 73.8567"
                />
              </div>
              <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-600 dark:text-white/60 cursor-pointer">Mark as Featured</label>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-3 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 text-xs"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 px-6 py-4 border-t border-gray-100 dark:border-white/10">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-navy disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
}

export default function PropertiesAdmin() {
  const { isMgmt, user } = useAdmin();
  const isAgent = user?.role === 'agent';
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProperties({ limit: 100 });
      setProperties(data.properties);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (body) => {
    await createProperty(body);
    await load();
  };

  const handleUpdate = async (body) => {
    await updateProperty(editing._id, body);
    await load();
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    const id = propertyToDelete._id;
    setDeleting(id);
    setDeleteError('');
    try {
      await deleteProperty(id);
      await load();
      setPropertyToDelete(null);
      setDeleteError('');
    } catch (e) {
      console.error("Delete property failed:", e);
      setDeleteError(e.message || 'Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const activeLocalities = CITIES.filter(loc =>
    properties.some(p => p.location.toLowerCase().includes(loc.toLowerCase()))
  );
  const statuses = Array.from(new Set(properties.map(p => p.status).filter(Boolean)));

  const getPropertyLocality = (p) => {
    const found = CITIES.find(c => p.location.toLowerCase().includes(c.toLowerCase()));
    if (found) return found;
    return p.location || p.city || 'Pune';
  };

  const filtered = properties.filter(p => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesLocality = cityFilter === 'all' || p.location.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesLocality && matchesStatus;
  });

  return (
    <div className="pb-8">

      {/* Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Properties</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{properties.length} active listings</p>
        </div>
        {isMgmt && (
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer shadow-md shadow-gold/15"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            <Plus className="w-4 h-4" /> Add Property
          </button>
        )}
      </div>

      {/* Real-time search and filter controls bar */}
      <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search properties by title or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-11 py-0 rounded-2xl border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-sm text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors shadow-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25">
            <Search className="w-4 h-4" />
          </span>
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            value={cityFilter}
            onChange={setCityFilter}
            placeholder="All Localities"
            options={[{ value: 'all', label: 'All Localities' }, ...activeLocalities.map(loc => ({ value: loc, label: loc }))]}
          />
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[{ value: 'all', label: 'All Statuses' }, ...statuses.map(s => ({ value: s, label: s }))]}
          />
        </div>
      </div>

      {/* Properties List Table */}
      {loading ? (
        <div className="p-4 space-y-4">
          <div className="hidden lg:block">
            <SkeletonTable rows={5} cols={5} />
          </div>
          <div className="block lg:hidden space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white dark:bg-navy-light border border-gray-100 dark:border-white/5 flex gap-3 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-4.5 w-full bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
          <Building2 className="w-12 h-12 text-gray-200 dark:text-white/15 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/35 mb-4 text-sm">No properties match search query</p>
          {isMgmt && (
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              Add Property
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="w-full">
            {/* MOBILE LAYOUT: Flex cards stack */}
            <div className="block lg:hidden space-y-4 p-4">
              {filtered.map(p => (
                <div key={p._id} className="p-4 rounded-2xl bg-white dark:bg-navy-light border border-gray-100 dark:border-white/5 flex flex-col gap-3 relative shadow-card transition-all duration-200">
                  
                  {/* Header Row: Image, Type, Title, Location */}
                  <div className="flex gap-3">
                    {p.image ? (
                      <img src={p.image} alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10 border border-gold/15" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-gray-400 dark:text-white/30" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-transparent dark:border-white/5">
                          {p.type}
                        </span>
                        {p.featured && (
                          <span className="flex items-center gap-0.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/10">
                            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500 shrink-0" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-navy dark:text-white text-sm leading-snug line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-gray-400 dark:text-white/30 truncate">{getPropertyLocality(p)}</p>
                    </div>
                  </div>

                  {/* Middle Row: Price, Status, Agent */}
                  <div className="flex flex-col gap-2 py-2 border-t border-b border-gray-100 dark:border-white/5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-navy dark:text-white text-sm">{p.priceLabel || `₹${(p.price / 10000000).toFixed(1)}Cr`}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${p.status === 'Ready to Move' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                        p.status === 'Under Construction' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50'
                      }`}>{p.status}</span>
                    </div>

                    {!isAgent && (
                      <div className="flex items-center justify-between gap-4 pt-1">
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-white/20 tracking-wider">Assigned Agent</span>
                        <div className="flex items-center gap-2">
                          {p.agent?.name ? (
                            <>
                              <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/15">
                                <span className="text-[9px] font-black text-gold">{p.agent.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-[10px] font-bold text-navy dark:text-white leading-none">{p.agent.name}</span>
                            </>
                          ) : (
                            <span className="text-[9px] text-gray-400 dark:text-white/20 italic">Unassigned</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Action buttons */}
                  {isMgmt && (
                    <div className="flex items-center justify-end gap-1 pt-1">
                      <button onClick={() => { setEditing(p); setShowForm(true); }}
                        className="p-1.5 rounded-lg text-gray-405 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer" title="Edit Property">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPropertyToDelete(p)}
                        className="p-1.5 rounded-lg text-gray-405 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Delete Property">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* DESKTOP LAYOUT: Traditional Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/10 text-[10px] font-extrabold text-gray-400 dark:text-white/30 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Property</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">Locality</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Featured</th>
                    {!isAgent && <th className="px-6 py-3.5">Agent</th>}
                    {isMgmt && <th className="px-6 py-3.5">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10 border border-gold/15" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5 text-gray-400 dark:text-white/30" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-navy dark:text-white text-sm truncate max-w-[200px] group-hover:text-gold transition-colors">{p.title}</p>
                            <p className="text-[10px] text-gray-400 dark:text-white/30 truncate max-w-[200px] mt-0.5">{p.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-transparent dark:border-white/5">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-655 dark:text-white/55 font-bold">{getPropertyLocality(p)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-black text-navy dark:text-white text-xs">{p.priceLabel || `₹${(p.price / 10000000).toFixed(1)}Cr`}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${p.status === 'Ready to Move' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                            p.status === 'Under Construction' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                            'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50'
                          }`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.featured ? (
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/10 shadow-sm">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 shrink-0" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-gray-400 dark:text-white/20 pl-2">No</span>
                        )}
                      </td>
                      {!isAgent && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {p.agent?.name ? (
                              <>
                                <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/15">
                                  <span className="text-[10px] font-black text-gold">{p.agent.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-navy dark:text-white leading-none">{p.agent.name}</p>
                                  <p className="text-[9px] text-gray-400 dark:text-white/30 mt-0.5">{p.agent.phone}</p>
                                </div>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 dark:text-white/20 italic">Unassigned</span>
                            )}
                          </div>
                        </td>
                      )}
                      {isMgmt && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditing(p); setShowForm(true); }}
                              className="p-2 rounded-xl text-gray-405 hover:text-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Edit Property">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setPropertyToDelete(p)}
                              className="p-2 rounded-xl text-gray-405 hover:text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Delete Property">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <PropertyForm
          initial={editing}
          onSave={editing ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {propertyToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#071A2F] border border-gray-150 dark:border-white/10 shadow-luxury text-left"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-base mb-2">Remove Property?</h3>
                <p className="text-xs text-ink-muted dark:text-white/60 leading-relaxed mb-4">
                  Are you sure you want to remove <span className="font-bold text-navy dark:text-white">{propertyToDelete.title}</span>? This will permanently delete the listing.
                </p>

                {deleteError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => { setPropertyToDelete(null); setDeleteError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting === propertyToDelete._id}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-655 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {deleting === propertyToDelete._id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                      </>
                    ) : (
                      'Delete Property'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
