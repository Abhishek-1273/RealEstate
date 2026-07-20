import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTestimonialsAdmin, createTestimonialAdmin, updateTestimonialAdmin, deleteTestimonialAdmin, uploadImage } from '../../utils/adminApi';
import { Plus, Pencil, Trash2, Loader2, Star, Eye, EyeOff, X, Image, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputCls = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1.5";

const EMPTY_TESTIMONIAL = {
  name: '',
  role: '',
  image: '',
  rating: 5,
  text: '',
  property: '',
  isActive: true
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(EMPTY_TESTIMONIAL);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonialsAdmin({ all: 'true' });
      setTestimonials(data.testimonials || []);
    } catch (err) {
      setError(err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setCurrentTestimonial(EMPTY_TESTIMONIAL);
    setIsEditing(false);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setCurrentTestimonial({ ...t });
    setIsEditing(true);
    setError('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (t) => {
    try {
      const updated = await updateTestimonialAdmin(t._id, { isActive: !t.isActive });
      setTestimonials(prev => prev.map(item => item._id === t._id ? updated.testimonial : item));
      setSuccess(`Testimonial for "${t.name}" status updated.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setCurrentTestimonial(prev => ({ ...prev, image: url }));
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        const data = await updateTestimonialAdmin(currentTestimonial._id, currentTestimonial);
        setTestimonials(prev => prev.map(item => item._id === currentTestimonial._id ? data.testimonial : item));
        setSuccess(`Testimonial for "${currentTestimonial.name}" updated successfully.`);
      } else {
        const data = await createTestimonialAdmin(currentTestimonial);
        setTestimonials(prev => [data.testimonial, ...prev]);
        setSuccess(`Testimonial for "${currentTestimonial.name}" created successfully.`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTestimonialAdmin(deleteConfirm._id);
      setTestimonials(prev => prev.filter(item => item._id !== deleteConfirm._id));
      setSuccess(`Testimonial for "${deleteConfirm.name}" deleted successfully.`);
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-navy dark:text-white">Client Testimonials</h1>
          <p className="text-sm text-ink-muted dark:text-white/50">Manage dynamic client reviews and properties feedback shown on the homepage.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs py-3 px-5 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 cursor-pointer shadow-luxury shrink-0 animate-fade-in"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-105 dark:border-white/5">
          <Quote className="w-12 h-12 text-gray-300 dark:text-white/10 mx-auto mb-3" />
          <p className="text-sm text-ink-muted dark:text-white/40">No testimonials found. Add a client review to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t._id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#0E1A2B] border border-gray-100 dark:border-white/5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg relative group ${!t.isActive ? 'opacity-60' : ''}`}
            >
              {/* Top Row: Client Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-150 dark:border-white/10">
                      <img src={t.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-navy dark:text-white">{t.name}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-white/40 font-medium leading-none mt-1">{t.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    t.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/10' : 'bg-gray-400/10 text-gray-400 border border-gray-400/10'
                  }`}>
                    {t.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < t.rating ? '' : 'text-gray-200 dark:text-white/10'}`} />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-ink-muted dark:text-cream/70 leading-[1.8] italic font-medium line-clamp-4">
                  "{t.text}"
                </p>

                {/* Property Detail */}
                {t.property && (
                  <p className="text-[10px] text-gold font-bold">Property: {t.property}</p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4 mt-6">
                <button
                  onClick={() => handleToggleStatus(t)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-gray-550 hover:text-navy dark:text-white/50 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Activate
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                    title="Edit Testimonial"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(t)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save / Edit Modal */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-xl bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-luxury overflow-hidden border border-gray-100 dark:border-white/10 max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-150 dark:border-white/15 flex items-center justify-between">
                  <h3 className="font-display font-black text-navy dark:text-white text-lg">
                    {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-150 dark:border-white/10">
                      <img src={currentTestimonial.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-wider">Client Photo</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={currentTestimonial.image || ''}
                          onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="Or paste direct image URL"
                          className={`${inputCls} py-2 text-xs`}
                        />
                        <label className="shrink-0 flex items-center justify-center p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 cursor-pointer transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          {uploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                          ) : (
                            <Image className="w-3.5 h-3.5 text-gray-500" />
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Client Name</label>
                      <input
                        type="text"
                        required
                        value={currentTestimonial.name}
                        onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Rajiv Singhania"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={currentTestimonial.role}
                        onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g. NRI — Based in Dubai"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        required
                        value={currentTestimonial.rating}
                        onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Property Purchased (Optional)</label>
                      <input
                        type="text"
                        value={currentTestimonial.property}
                        onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, property: e.target.value }))}
                        placeholder="e.g. Elysian Heights, KP, Pune"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Client Review Text</label>
                    <textarea
                      required
                      rows={4}
                      value={currentTestimonial.text}
                      onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Write review description..."
                      className={`${inputCls} h-28 resize-none`}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-150 dark:border-white/15">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-extrabold text-xs py-3 px-6 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer shadow-luxury"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        'Save Testimonial'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {deleteConfirm && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-md bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-luxury p-6 border border-gray-100 dark:border-white/10"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-lg mb-2">Delete Testimonial</h3>
                <p className="text-sm text-ink-muted dark:text-white/50 leading-relaxed">
                  Are you sure you want to delete testimonial for <strong>{deleteConfirm.name}</strong>? This action is permanent and it will be removed from the homepage reviews slider immediately.
                </p>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2.5 rounded-xl bg-red-655 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Confirm Delete
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
