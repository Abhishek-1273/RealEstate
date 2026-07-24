import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getFaqsAdmin, createFaqAdmin, updateFaqAdmin, deleteFaqAdmin } from '../../utils/adminApi';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, X, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputCls = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
const labelCls = "block text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-1.5";

const EMPTY_FAQ = {
  question: '',
  answer: '',
  order: 0,
  isActive: true
};

export default function FaqsAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(EMPTY_FAQ);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await getFaqsAdmin({ all: 'true' });
      setFaqs(data.faqs || []);
    } catch (err) {
      setError(err.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenAdd = () => {
    setCurrentFaq({ ...EMPTY_FAQ, order: faqs.length });
    setIsEditing(false);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setCurrentFaq({ ...f });
    setIsEditing(true);
    setError('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (f) => {
    try {
      const updated = await updateFaqAdmin(f._id, { isActive: !f.isActive });
      setFaqs(prev => prev.map(item => item._id === f._id ? updated.faq : item));
      setSuccess(`FAQ status updated.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleMove = async (f, direction) => {
    const currentIndex = faqs.findIndex(item => item._id === f._id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === faqs.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetFaq = faqs[targetIndex];

    try {
      // Swap order attributes
      const updatedCurrent = await updateFaqAdmin(f._id, { order: targetFaq.order });
      const updatedTarget = await updateFaqAdmin(targetFaq._id, { order: f.order });

      // Update state and resort
      setFaqs(prev => {
        const copy = prev.map(item => {
          if (item._id === f._id) return updatedCurrent.faq;
          if (item._id === targetFaq._id) return updatedTarget.faq;
          return item;
        });
        return copy.sort((a, b) => a.order - b.order);
      });
      setSuccess('FAQ order updated.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to reorder FAQ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        const data = await updateFaqAdmin(currentFaq._id, currentFaq);
        setFaqs(prev => prev.map(item => item._id === currentFaq._id ? data.faq : item).sort((a, b) => a.order - b.order));
        setSuccess('FAQ updated successfully.');
      } else {
        const data = await createFaqAdmin(currentFaq);
        setFaqs(prev => [...prev, data.faq].sort((a, b) => a.order - b.order));
        setSuccess('FAQ created successfully.');
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteFaqAdmin(deleteConfirm._id);
      setFaqs(prev => prev.filter(item => item._id !== deleteConfirm._id));
      setSuccess('FAQ deleted successfully.');
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-navy dark:text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-ink-muted dark:text-white/50">Manage dynamic FAQ sections that appear on the Contact Us page.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs py-3 px-5 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 cursor-pointer shadow-luxury shrink-0"
        >
          <Plus className="w-4 h-4" /> Add FAQ
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

      {/* FAQ Accordion List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-105 dark:border-white/5">
          <HelpCircle className="w-12 h-12 text-gray-300 dark:text-white/10 mx-auto mb-3" />
          <p className="text-sm text-ink-muted dark:text-white/40">No FAQs found. Add your first question to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={f._id}
              className={`p-5 rounded-3xl bg-white dark:bg-[#0E1A2B] border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md ${!f.isActive ? 'opacity-60' : ''}`}
            >
              {/* Question / Answer Info */}
              <div className="space-y-2 flex-1 min-w-0 w-full">
                <div className="flex items-start justify-between gap-2.5 min-w-0 w-full">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="text-xs font-black text-gold shrink-0 mt-0.5">Q{i + 1}.</span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-navy dark:text-white leading-snug break-words">{f.question}</h4>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                    f.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                  }`}>
                    {f.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-ink-muted dark:text-cream/70 leading-relaxed font-medium pl-5">
                  {f.answer}
                </p>
              </div>


              {/* Order & Actions Controls */}
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5">
                {/* Ordering */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(f, 'up')}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-gray-500 dark:text-white/60" />
                  </button>
                  <button
                    onClick={() => handleMove(f, 'down')}
                    disabled={i === faqs.length - 1}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-gray-500 dark:text-white/60" />
                  </button>
                </div>

                {/* Status / Edit / Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(f)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                    title={f.isActive ? 'Deactivate FAQ' : 'Activate FAQ'}
                  >
                    {f.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(f)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(f)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete FAQ"
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
                    {isEditing ? 'Edit FAQ Entry' : 'Add New FAQ'}
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
                  <div>
                    <label className={labelCls}>Question</label>
                    <input
                      type="text"
                      required
                      value={currentFaq.question}
                      onChange={(e) => setCurrentFaq(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Enter question title"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Answer</label>
                    <textarea
                      required
                      rows={5}
                      value={currentFaq.answer}
                      onChange={(e) => setCurrentFaq(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Write answer details..."
                      className={`${inputCls} h-32 resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Display Order Index</label>
                      <input
                        type="number"
                        required
                        value={currentFaq.order}
                        onChange={(e) => setCurrentFaq(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className={inputCls}
                      />
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
                      disabled={submitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy font-extrabold text-xs py-3 px-6 rounded-xl transition-all duration-200 hover:brightness-105 active:scale-95 disabled:opacity-60 cursor-pointer shadow-luxury"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        'Save FAQ'
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
                <h3 className="font-display font-black text-navy dark:text-white text-lg mb-2">Delete FAQ</h3>
                <p className="text-sm text-ink-muted dark:text-white/50 leading-relaxed">
                  Are you sure you want to delete this FAQ entry? This action is permanent and it will be removed from the public website FAQ accordion immediately.
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
