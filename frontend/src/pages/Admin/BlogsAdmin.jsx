import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, X, Loader2, FileText, ChevronDown, Search, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBlogs } from '../../utils/api';
import { createBlogAdmin, updateBlogAdmin, deleteBlogAdmin } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';
import ImageUploader from '../../components/common/ImageUploader';

const CATEGORIES = ['Market Updates', 'NRI Guides', 'Luxury Design', 'Investment Tips', 'Pune Trends'];

const CATEGORY_STYLE = {
  'Market Updates':    { color: '#D4AF37', bg: '#FFFDF5', darkBg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.15)' },
  'NRI Guides':        { color: '#8B5CF6', bg: '#F5F3FF', darkBg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.15)' },
  'Luxury Design':     { color: '#EC4899', bg: '#FDF2F8', darkBg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.15)' },
  'Investment Tips':   { color: '#10B981', bg: '#ECFDF5', darkBg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.15)' },
  'Pune Trends':       { color: '#3B82F6', bg: '#EFF6FF', darkBg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.15)' }
};

const inputCls = "w-full px-4 py-3 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors";
const labelCls = "block text-[10px] font-extrabold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-1.5";

function CustomSelect({ value, onChange, options, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
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
        className={`w-full flex items-center justify-between px-4 h-11 py-0 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-left transition-colors duration-200 focus:outline-none focus:border-gold/50 ${className}`}
      >
        <span className={value ? "text-navy dark:text-white font-medium" : "text-gray-400 dark:text-white/30"}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-405 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 py-1.5"
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
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${active
                      ? 'bg-gold/10 text-gold-dark dark:text-gold'
                      : 'text-gray-707 dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
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
        image: form.image,
        readTime: form.readTime,
        author: {
          name: form.authorName,
          image: form.authorImage
        }
      };
      await onSave(blog?._id, payload);
      onClose();
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-2xl w-full max-w-lg p-6 border border-gray-150 dark:border-white/10 transition-colors duration-300 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            {blog ? 'Edit Blog Article' : 'Write New Article'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Blog Title</label>
            <input type="text" value={form.title}
              placeholder="e.g. Pune Property Market Trends 2026"
              onChange={e => handleTitleChange(e.target.value)}
              className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" value={form.slug}
                placeholder="auto-generated-slug"
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <CustomSelect
                value={form.category}
                onChange={val => setForm(p => ({ ...p, category: val }))}
                placeholder="Select category"
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Read Time</label>
              <input type="text" value={form.readTime}
                placeholder="e.g. 6 min read"
                onChange={e => setForm(p => ({ ...p, readTime: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Author Name</label>
              <input type="text" value={form.authorName}
                placeholder="Author's name"
                onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))}
                className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Cover Image</label>
            <ImageUploader value={form.image} onChange={val => setForm(p => ({ ...p, image: val }))} />
          </div>

          <div>
            <label className={labelCls}>Short Excerpt / Summary</label>
            <input type="text" value={form.excerpt}
              placeholder="Brief summary of the article..."
              onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
              className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Article Body Content (HTML or Plain Text)</label>
            <textarea value={form.body} rows={6}
              placeholder="Write article details here..."
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors font-sans resize-y" />
          </div>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-xs mb-3 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/15 mt-3">{error}</p>
        )}

        <div className="flex gap-2 border-t border-gray-150 dark:border-white/10 pt-4 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-xs font-bold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer">Cancel</button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-black text-navy disabled:opacity-50 cursor-pointer shadow-lg shadow-gold/15"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading ? 'Publishing…' : (blog ? 'Save Changes' : 'Publish Article')}
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
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  
  // Custom delete state
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isDark = document.documentElement.classList.contains('dark');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs();
      setBlogs(data.blogs || data || []);
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

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteBlogAdmin(blogToDelete._id);
      setBlogs(prev => prev.filter(b => b._id !== blogToDelete._id));
      setBlogToDelete(null);
      setDeleteError('');
    } catch (e) {
      console.error("Delete blog failed:", e);
      setDeleteError(e.message || 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  // Local Search & Filter logic
  const filtered = blogs.filter(b => {
    const matchesSearch = !search || 
      b.title.toLowerCase().includes(search.toLowerCase()) || 
      (b.subtitle && b.subtitle.toLowerCase().includes(search.toLowerCase())) ||
      (b.author?.name && b.author.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = catFilter === 'all' || b.category === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="pb-8">
      
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Blog Manager</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{blogs.length} published articles</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer shadow-md shadow-gold/15"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search articles by title, subtitle or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-11 py-0 rounded-2xl border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-sm text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors shadow-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25">
            <Search className="w-4 h-4" />
          </span>
        </div>

        <div className="w-full sm:w-56">
          <CustomSelect
            value={catFilter}
            onChange={setCatFilter}
            placeholder="All Categories"
            options={[{ value: 'all', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c, label: c }))] }
          />
        </div>
      </div>

      {/* Blogs list Table */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-gold" style={{ color: '#D4AF37' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-white/30 text-sm">No articles published match query</p>
          </div>
        ) : (
          <div className="w-full">
            {/* MOBILE LAYOUT: Flex cards stack */}
            <div className="block lg:hidden space-y-4 p-4">
              {filtered.map(b => {
                const m = CATEGORY_STYLE[b.category] || CATEGORY_STYLE['Market Updates'];
                return (
                  <div key={b._id} className="p-4 rounded-2xl bg-white dark:bg-navy-light border border-gray-100 dark:border-white/5 flex flex-col gap-3 relative shadow-card transition-all duration-200">
                    
                    {/* Header Row: Cover image, title, category */}
                    <div className="flex gap-3">
                      {b.image ? (
                        <img src={b.image} alt={b.title} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-gray-450 dark:text-white/20" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border inline-block"
                          style={{
                            backgroundColor: isDark ? m.darkBg : m.bg,
                            color: m.color,
                            borderColor: m.border
                          }}>
                          {b.category}
                        </span>
                        <h4 className="font-bold text-navy dark:text-white text-sm leading-snug line-clamp-1">{b.title}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-white/30 truncate">{b.excerpt || 'No summary text'}</p>
                      </div>
                    </div>

                    {/* Middle Row: Author & Details */}
                    <div className="flex items-center justify-between gap-4 py-2 border-t border-b border-gray-100 dark:border-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        {b.author?.image ? (
                          <img src={b.author.image} alt={b.author.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-gold/15" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/5">
                            <span className="text-[8px] font-bold text-navy dark:text-white">{b.author?.name?.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <span className="font-semibold text-gray-650 dark:text-white/60 text-[10px]">{b.author?.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-white/50 font-bold">{b.readTime || '5 min read'}</span>
                    </div>

                    {/* Bottom Row: Slug & Actions */}
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <p className="text-[10px] text-gray-400 dark:text-white/35 font-medium truncate max-w-[170px]" title={b.slug}>
                        Slug: {b.slug}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => setModalBlog(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer" title="Edit Article">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setBlogToDelete(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Delete Article">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP LAYOUT: Traditional Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/10 text-[10px] font-extrabold text-gray-400 dark:text-white/30 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Article</th>
                    <th className="px-6 py-3.5">Author</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Read Time</th>
                    <th className="px-6 py-3.5">Slug</th>
                    <th className="px-6 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.map(b => {
                    const m = CATEGORY_STYLE[b.category] || CATEGORY_STYLE['Market Updates'];
                    return (
                      <tr key={b._id} className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {b.image ? (
                              <img src={b.image} alt={b.title} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-gray-455 dark:text-white/20" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-navy dark:text-white text-sm truncate max-w-[220px] group-hover:text-gold transition-colors">{b.title}</p>
                              <p className="text-[10px] text-gray-400 dark:text-white/30 truncate max-w-[220px] mt-0.5">{b.excerpt || 'No summary text'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {b.author?.image ? (
                              <img src={b.author.image} alt={b.author.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gold/15" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/5">
                                <span className="text-[9px] font-bold text-navy dark:text-white">{b.author?.name?.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                            <span className="text-xs font-semibold text-gray-650 dark:text-white/60">{b.author?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md border"
                            style={{
                              backgroundColor: isDark ? m.darkBg : m.bg,
                              color: m.color,
                              borderColor: m.border
                            }}>
                            {b.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-650 dark:text-white/50 font-bold">{b.readTime || '5 min read'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-455 dark:text-white/30 truncate max-w-[120px] font-medium">{b.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setModalBlog(b)} className="p-2 rounded-xl text-gray-400 hover:text-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Edit Article">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setBlogToDelete(b)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Delete Article">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <BlogEditModal onSave={handleCreate} onClose={() => setShowAdd(false)} />
      )}
      {modalBlog && (
        <BlogEditModal blog={modalBlog} onSave={handleUpdate} onClose={() => setModalBlog(null)} />
      )}

      {/* Custom Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {blogToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#071A2F] border border-gray-150 dark:border-white/10 shadow-luxury text-left animate-fade-in"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-base mb-2">Delete Article?</h3>
                <p className="text-xs text-ink-muted dark:text-white/60 leading-relaxed mb-4">
                  Are you sure you want to remove <span className="font-bold text-navy dark:text-white">{blogToDelete.title}</span>? This will permanently delete the published article.
                </p>

                {deleteError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => { setBlogToDelete(null); setDeleteError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-655 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                      </>
                    ) : (
                      'Delete Article'
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
