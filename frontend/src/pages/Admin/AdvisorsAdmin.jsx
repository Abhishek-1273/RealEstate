import { useState, useEffect } from 'react';
import { getAdvisorsAdmin, createAdvisorAdmin, updateAdvisorAdmin, deleteAdvisorAdmin, uploadImage } from '../../utils/adminApi';
import { Plus, Pencil, Trash2, Loader2, Award, Star, Eye, EyeOff, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const inputCls = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1.5";

const EMPTY_ADVISOR = {
  name: '',
  role: '',
  experience: 0,
  propertiesSold: 0,
  rating: 5.0,
  reviews: 0,
  phone: '',
  email: '',
  image: '',
  specialization: '',
  socials: { linkedin: '#', instagram: '#', twitter: '#' },
  isActive: true
};

export default function AdvisorsAdmin() {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAdvisor, setCurrentAdvisor] = useState(EMPTY_ADVISOR);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAdvisors = async () => {
    setLoading(true);
    try {
      const data = await getAdvisorsAdmin({ all: 'true' });
      setAdvisors(data.advisors || []);
    } catch (err) {
      setError(err.message || 'Failed to load advisors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisors();
  }, []);

  const handleOpenAdd = () => {
    setCurrentAdvisor(EMPTY_ADVISOR);
    setIsEditing(false);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (advisor) => {
    // Convert array to comma separated string for form
    const specStr = Array.isArray(advisor.specialization) ? advisor.specialization.join(', ') : '';
    setCurrentAdvisor({
      ...advisor,
      specialization: specStr,
      socials: advisor.socials || { linkedin: '#', instagram: '#', twitter: '#' }
    });
    setIsEditing(true);
    setError('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (advisor) => {
    try {
      const updated = await updateAdvisorAdmin(advisor._id, { isActive: !advisor.isActive });
      setAdvisors(prev => prev.map(a => a._id === advisor._id ? updated.advisor : a));
      setSuccess(`Advisor "${advisor.name}" status updated.`);
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
      setCurrentAdvisor(prev => ({ ...prev, image: url }));
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

    // Process specializations into clean array
    const specs = currentAdvisor.specialization
      ? currentAdvisor.specialization.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...currentAdvisor,
      specialization: specs
    };

    try {
      if (isEditing) {
        const data = await updateAdvisorAdmin(currentAdvisor._id, payload);
        setAdvisors(prev => prev.map(a => a._id === currentAdvisor._id ? data.advisor : a));
        setSuccess(`Advisor "${payload.name}" updated successfully.`);
      } else {
        const data = await createAdvisorAdmin(payload);
        setAdvisors(prev => [data.advisor, ...prev]);
        setSuccess(`Advisor "${payload.name}" created successfully.`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save advisor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteAdvisorAdmin(deleteConfirm._id);
      setAdvisors(prev => prev.filter(a => a._id !== deleteConfirm._id));
      setSuccess(`Advisor "${deleteConfirm.name}" deleted successfully.`);
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete advisor');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-navy dark:text-white">Advisors Panel</h1>
          <p className="text-sm text-ink-muted dark:text-white/50">Manage the real estate advisors and agents displayed in the "About Us" team grid.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs py-3 px-5 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 cursor-pointer shadow-luxury shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Team Advisor
        </button>
      </div>

      {/* Success and Error notifications */}
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

      {/* Table & Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : advisors.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy rounded-3xl border border-gray-150 dark:border-white/10">
          <Award className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-navy dark:text-white font-bold">No Advisors Configured</p>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-1">Get started by adding a team member advisor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {advisors.map(a => (
            <div key={a._id} className="relative rounded-3xl p-6 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card flex flex-col justify-between gap-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex gap-4">
                {/* Photo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-150 dark:border-white/10 bg-gray-50">
                  <img src={a.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200'} alt={a.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-base text-navy dark:text-white truncate">{a.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      a.isActive 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' 
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/10'
                    }`}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gold font-bold truncate mt-0.5">{a.role}</p>
                  
                  <div className="flex items-center gap-1.5 mt-2 text-navy/70 dark:text-white/70">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold shrink-0" />
                    <span className="text-xs font-bold">{a.rating || 5.0}</span>
                    <span className="text-[10px] text-gray-400 dark:text-white/30 font-medium">({a.reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Stats & Specifics */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 dark:border-white/5 text-xs">
                <div>
                  <p className="text-[10px] font-accent text-gray-400 dark:text-white/30 uppercase tracking-widest">Experience</p>
                  <p className="font-bold text-navy dark:text-white mt-0.5">{a.experience || 0} Years</p>
                </div>
                <div>
                  <p className="text-[10px] font-accent text-gray-400 dark:text-white/30 uppercase tracking-widest">Properties Sold</p>
                  <p className="font-bold text-navy dark:text-white mt-0.5">{a.propertiesSold || 0} Deals</p>
                </div>
                {a.specialization && a.specialization.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-accent text-gray-400 dark:text-white/30 uppercase tracking-widest">Specialization</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {a.specialization.map((spec, i) => (
                        <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => handleToggleStatus(a)}
                  className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 hover:text-navy dark:text-white/40 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {a.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Activate
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(a)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white/60 transition-colors cursor-pointer"
                    title="Edit Advisor"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(a)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                    title="Delete Advisor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              className="relative w-full max-w-2xl bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-luxury border border-gray-100 dark:border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-150 dark:border-white/15 flex items-center justify-between">
                <h3 className="font-display font-black text-navy dark:text-white text-lg">
                  {isEditing ? 'Edit Team Advisor' : 'Add New Advisor'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-navy dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Profile Photo Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gray-55 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-150 dark:border-white/10">
                    <img src={currentAdvisor.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-navy dark:text-white">Profile Picture</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">Upload a transparent or clear professional square avatar.</p>
                  </div>
                  <div className="shrink-0">
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 cursor-pointer text-xs font-bold transition-all text-navy dark:text-white">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                      ) : (
                        <Image className="w-3.5 h-3.5" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                </div>

                {/* Main Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Advisor Name</label>
                    <input
                      type="text"
                      required
                      value={currentAdvisor.name}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Arjun Kapoor"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Designation/Role</label>
                    <input
                      type="text"
                      required
                      value={currentAdvisor.role}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Senior NRI Property Advisor"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div>
                    <label className={labelCls}>Experience (Years)</label>
                    <input
                      type="number"
                      value={currentAdvisor.experience}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Properties Sold</label>
                    <input
                      type="number"
                      value={currentAdvisor.propertiesSold}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, propertiesSold: parseInt(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={currentAdvisor.rating}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, rating: parseFloat(e.target.value) || 5.0 }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Reviews Count</label>
                    <input
                      type="number"
                      value={currentAdvisor.reviews}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, reviews: parseInt(e.target.value) || 0 }))}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Contact Phone</label>
                    <input
                      type="text"
                      value={currentAdvisor.phone || ''}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Email</label>
                    <input
                      type="email"
                      value={currentAdvisor.email || ''}
                      onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="arjun@hyperrelestix.in"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Specializations (Comma separated)</label>
                  <input
                    type="text"
                    value={currentAdvisor.specialization}
                    onChange={(e) => setCurrentAdvisor(prev => ({ ...prev, specialization: e.target.value }))}
                    placeholder="e.g. KP, NRI Investment, Luxury Penthouses"
                    className={inputCls}
                  />
                </div>

                {/* Social links */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <p className="text-xs font-bold text-navy dark:text-white uppercase tracking-wider">Social Channels</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className={labelCls}>LinkedIn Link</label>
                      <input
                        type="text"
                        value={currentAdvisor.socials.linkedin}
                        onChange={(e) => setCurrentAdvisor(prev => ({
                          ...prev,
                          socials: { ...prev.socials, linkedin: e.target.value }
                        }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Instagram Link</label>
                      <input
                        type="text"
                        value={currentAdvisor.socials.instagram}
                        onChange={(e) => setCurrentAdvisor(prev => ({
                          ...prev,
                          socials: { ...prev.socials, instagram: e.target.value }
                        }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Twitter Link</label>
                      <input
                        type="text"
                        value={currentAdvisor.socials.twitter}
                        onChange={(e) => setCurrentAdvisor(prev => ({
                          ...prev,
                          socials: { ...prev.socials, twitter: e.target.value }
                        }))}
                        className={inputCls}
                      />
                    </div>
                  </div>
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
                      'Save Advisor'
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
                <h3 className="font-display font-black text-navy dark:text-white text-lg mb-2">Delete Advisor</h3>
                <p className="text-sm text-ink-muted dark:text-white/50 leading-relaxed">
                  Are you sure you want to delete advisor <strong>{deleteConfirm.name}</strong>? This action cannot be undone and they will be removed from the About page team list.
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
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    {deleting ? 'Deleting…' : 'Confirm Delete'}
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
