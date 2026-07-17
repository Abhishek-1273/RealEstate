import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPartnersAdmin, createPartner, updatePartner, deletePartner } from '../../utils/adminApi';
import { createPortal } from 'react-dom';

const inputCls = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1.5";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Fetch partners list
  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await getPartnersAdmin();
      setPartners(data.partners || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // Handle Add Partner
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const data = await createPartner({ name: name.trim() });
      setPartners(prev => [...prev, data.partner].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
    } catch (err) {
      setError(err.message || 'Failed to add partner');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle visibility status
  const handleToggleVisibility = async (id, currentVal) => {
    try {
      const data = await updatePartner(id, { visible: !currentVal });
      setPartners(prev => prev.map(p => p._id === id ? data.partner : p));
    } catch (err) {
      setError(err.message || 'Failed to update partner visibility');
    }
  };

  // Handle delete partner
  const handleDelete = async () => {
    if (!partnerToDelete) return;
    console.log("handleDelete triggered for:", partnerToDelete);
    setDeleting(true);
    setDeleteError('');
    try {
      console.log("Sending delete api request for ID:", partnerToDelete._id);
      await deletePartner(partnerToDelete._id);
      console.log("Delete request succeeded");
      setPartners(prev => prev.filter(p => p._id !== partnerToDelete._id));
      setSuccessMsg(`Successfully deleted partner "${partnerToDelete.name}"`);
      setPartnerToDelete(null);
      setDeleteError('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Delete partner failed error:", err);
      setDeleteError(err.message || 'Failed to delete partner');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-navy dark:text-white">Developer Partners</h1>
          <p className="text-sm text-ink-muted dark:text-white/50">Manage dynamic developer builders partners shown on the homepage marquee.</p>
        </div>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between"
          >
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700 font-bold px-2 text-sm">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Add Partner form */}
        <div className="lg:col-span-1">
          <div className="p-4 md:p-6 rounded-3xl bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card">
            <h3 className="font-display font-bold text-navy dark:text-white text-base mb-5">Add New Partner</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={labelCls}>Developer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Godrej Properties"
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs py-3.5 px-4 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Partner
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Partners List */}
        <div className="lg:col-span-2">
          <div className="p-4 md:p-6 rounded-3xl bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card">
            <h3 className="font-display font-bold text-navy dark:text-white text-base mb-5">Partner Directory ({partners.length})</h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-ink-soft dark:text-white/40">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-gold" />
                <span className="text-xs">Loading partners...</span>
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-20 text-ink-soft dark:text-white/40">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No partners added yet</p>
                <p className="text-xs mt-1">Add developer names on the left to display them.</p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse table-fixed min-w-[320px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] uppercase tracking-wider font-bold text-ink-soft dark:text-white/35">
                      <th className="pb-3 pl-2">Developer Name</th>
                      <th className="pb-3 text-center w-[100px]">Status</th>
                      <th className="pb-3 pr-2 text-right w-[70px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {partners.map((partner) => (
                        <motion.tr
                          key={partner._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="py-4 pl-2 font-display font-semibold text-sm text-navy dark:text-white truncate">
                            {partner.name}
                          </td>
                          <td className="py-4 text-center w-[100px]">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(partner._id, partner.visible)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${partner.visible
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-white/5 text-ink-soft dark:text-white/30 hover:bg-white/10'
                                }`}
                            >
                              {partner.visible ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Visible
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Hidden
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-4 pr-2 text-right w-[70px]">
                            <button
                              type="button"
                              onClick={() => setPartnerToDelete(partner)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Custom Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {partnerToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#071A2F] border border-gray-150 dark:border-white/10 shadow-luxury text-left"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-base mb-2">Remove Partner?</h3>
                <p className="text-xs text-ink-muted dark:text-white/60 leading-relaxed mb-4">
                  Are you sure you want to remove <span className="font-bold text-navy dark:text-white">{partnerToDelete.name}</span>? This will immediately remove them from the homepage marquee.
                </p>

                {deleteError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => { setPartnerToDelete(null); setDeleteError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                      </>
                    ) : (
                      'Delete Partner'
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
