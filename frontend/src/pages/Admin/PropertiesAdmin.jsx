import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Building2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProperties, createProperty, updateProperty, deleteProperty, uploadImage } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';
import ImageUploader from '../../components/common/ImageUploader';

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
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-left transition-colors duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 ${className}`}
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
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                    active
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
const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa', 'Chennai', 'Kolkata'];
const STATUSES = ['Ready to Move', 'Under Construction', 'Pre-Launch', 'Sold Out'];
const FURNISHING = ['Fully Furnished', 'Semi Furnished', 'Shell Condition'];

const EMPTY = {
  title: '', type: 'Villa', city: 'Mumbai', location: '',
  price: '', priceLabel: '', bedrooms: '', bathrooms: '',
  area: '', parking: '', image: '', images: [], badge: '', badgeColor: 'gold',
  status: 'Ready to Move', furnishing: 'Shell Condition',
  developer: '', rera: '', description: '', featured: false,
};

function PropertyForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY;
    const images = initial.images && initial.images.length > 0
      ? initial.images
      : (initial.image ? [initial.image] : []);
    return { ...initial, images };
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [galleryLoading, setGalleryLoading] = useState(false);

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
      await onSave({ 
        ...form, 
        image: coverImage,
        price: Number(form.price), 
        bedrooms: Number(form.bedrooms), 
        bathrooms: Number(form.bathrooms), 
        area: Number(form.area), 
        parking: Number(form.parking) 
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
            <F label="City" name="city" options={CITIES} required />
            <F label="Location (Area, City)" name="location" required />
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
            <div className="flex items-center gap-2">
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
  const { isMgmt } = useAdmin();
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [deleting,   setDeleting]   = useState(null);

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

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteProperty(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>Properties</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{properties.length} active listings</p>
        </div>
        {isMgmt && (
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            <Plus className="w-4 h-4" /> Add Property
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#D4AF37' }} />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
          <Building2 className="w-12 h-12 text-gray-200 dark:text-white/15 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/35 mb-4">No properties yet</p>
          {isMgmt && (
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              Add First Property
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  {['Property', 'Type', 'City', 'Price', 'Status', 'Featured', ...(isMgmt ? ['Actions'] : [])].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {properties.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-gray-400 dark:text-white/30" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-navy dark:text-white text-sm truncate max-w-[180px]">{p.title}</p>
                          <p className="text-[11px] text-gray-400 dark:text-white/35 truncate">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60">{p.type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-600 dark:text-white/55">{p.city}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-navy dark:text-white text-[12px]">{p.priceLabel || `₹${(p.price/10000000).toFixed(1)}Cr`}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        p.status === 'Ready to Move' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                        p.status === 'Under Construction' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.featured ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-white/30'}`}>
                        {p.featured ? '★ Yes' : 'No'}
                      </span>
                    </td>
                    {isMgmt && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditing(p); setShowForm(true); }}
                            className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 transition-all disabled:opacity-50">
                            {deleting === p._id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Trash2 className="w-3.5 h-3.5" />
                            }
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
      )}

      {showForm && (
        <PropertyForm
          initial={editing}
          onSave={editing ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
