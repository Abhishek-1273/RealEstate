import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Loader2, FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBlogs } from '../../utils/api';
import { createBlogAdmin, updateBlogAdmin, deleteBlogAdmin } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';
import ImageUploader from '../../components/common/ImageUploader';

const CATEGORIES = ['Market Updates', 'NRI Guides', 'Luxury Design', 'Investment Tips', 'Pune Trends'];

const inputCls = "w-full px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1";

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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-left transition-colors duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 ${className}`}
      >
        <span className={value ? "text-navy dark:text-white" : "text-gray-400 dark:text-white/35"}>
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

function BlogEditModal({ blog, onSave, onClose }) {
  const { user } = useAdmin();
  const [form, setForm] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    category: blog?.category || 'Market Updates',
    excerpt: blog?.excerpt || '',
    body: blog?.body || '',
    image: blog?.image || '',
    readTime: blog?.readTime || '5 min read',
    authorName: blog?.author?.name || user?.name || '',
    authorImage: blog?.author?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    setForm(p => ({
      ...p,
      title: val,
      slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.body) {
      setError('Title, slug, and body content are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        excerpt: form.excerpt,
        body: form.body,
        image: form.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        readTime: form.readTime,
        author: {
          name: form.authorName,
          image: form.authorImage
        }
      };
      await onSave(blog?._id, payload);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl shadow-2xl w-full max-w-2xl p-6 border border-transparent dark:border-white/10 transition-colors duration-300 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-gray-150 dark:border-white/10 pb-3">
          <h3 className="font-bold text-navy dark:text-white text-base">
            {blog ? 'Edit Article' : 'Write New Article'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Article Title *</label>
              <input type="text" value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Pune Property Market Insights" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL Slug *</label>
              <input type="text" value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                placeholder="pune-property-market-insights" className={inputCls} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <CustomSelect
                value={form.category}
                onChange={val => setForm(p => ({ ...p, category: val }))}
                placeholder="Select category"
                options={CATEGORIES}
              />
            </div>
            <div>
              <label className={labelCls}>Read Time</label>
              <input type="text" value={form.readTime}
                onChange={e => setForm(p => ({ ...p, readTime: e.target.value }))}
                placeholder="e.g. 5 min read" className={inputCls} />
            </div>
          </div>
          <div className="pt-2">
            <ImageUploader
              value={form.image}
              onChange={url => setForm(p => ({ ...p, image: url }))}
              label="Article Banner Image"
            />
          </div>

          <div>
            <label className={labelCls}>Excerpt (Short Summary)</label>
            <textarea value={form.excerpt} rows={2}
              onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
              placeholder="Short teaser text..." className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Body Content (Supports Markdown) *</label>
            <textarea value={form.body} rows={8}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              placeholder="Write your article body here in plain text or Markdown format..." className={`${inputCls} font-mono text-xs`} />
          </div>

          <div className="border-t border-gray-100 dark:border-white/5 pt-4">
            <h4 className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider mb-3">Author Override Settings</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Author Name</label>
                <input type="text" value={form.authorName}
                  onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))}
                  className={inputCls} />
              </div>
              <div className="pt-1">
                <ImageUploader
                  value={form.authorImage}
                  onChange={url => setForm(p => ({ ...p, authorImage: url }))}
                  label="Author Avatar"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-xs mb-3 px-3 py-2 rounded-xl mt-3"
            style={{ background: '#FEF2F2' }}>{error}</p>
        )}

        <div className="flex gap-2 border-t border-gray-150 dark:border-white/10 pt-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-navy disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading ? 'Saving…' : 'Publish Blog'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalBlog, setModalBlog] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs();
      setBlogs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (_, payload) => {
    await createBlogAdmin(payload);
    await load();
  };

  const handleUpdate = async (id, payload) => {
    await updateBlogAdmin(id, payload);
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteBlogAdmin(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>Blog Manager</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{blogs.length} published articles</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#D4AF37' }} />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-white/30 text-sm">No articles published yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  {['Article', 'Author', 'Category', 'Read Time', 'Slug', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {blogs.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.image} alt={b.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="font-semibold text-navy dark:text-white text-sm truncate max-w-[200px]">{b.title}</p>
                          <p className="text-[11px] text-gray-400 dark:text-white/35 truncate max-w-[200px]">{b.excerpt || 'No summary text'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img src={b.author?.image} alt={b.author?.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-[12px] text-gray-600 dark:text-white/60">{b.author?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-600 dark:text-white/65">{b.category}</td>
                    <td className="px-5 py-4 text-[12px] text-gray-500 dark:text-white/55">{b.readTime}</td>
                    <td className="px-5 py-4 text-[11px] text-gray-400 dark:text-white/30 truncate max-w-[120px]">{b.slug}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModalBlog(b)} className="p-1 rounded hover:bg-gray-150 dark:hover:bg-white/10 text-gray-500 hover:text-navy dark:hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(b._id)} className="p-1 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <BlogEditModal onSave={handleCreate} onClose={() => setShowAdd(false)} />
      )}
      {modalBlog && (
        <BlogEditModal blog={modalBlog} onSave={handleUpdate} onClose={() => setModalBlog(null)} />
      )}
    </div>
  );
}
