import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Trash2, Loader2, X, Search, Database, MapPin, Building, Sparkles, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMasterDataList, createMasterData, updateMasterData, deleteMasterData } from '../../utils/adminApi';

const CATEGORIES = [
  { key: 'locality', label: 'Localities / Areas' },
  { key: 'city', label: 'Cities' },
  { key: 'amenity', label: 'Amenities' },
  { key: 'propertyType', label: 'Property Types' },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'locality': return <MapPin className="w-4 h-4 text-gold" />;
    case 'city': return <Building className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
    case 'amenity': return <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />;
    case 'propertyType': return <Home className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    default: return <Database className="w-4 h-4 text-blue-500" />;
  }
};

export default function MasterDataAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('locality');
  const [search, setSearch] = useState('');

  // Dialog/Form state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState(null); // null for add, item object for edit
  const [formValue, setFormValue] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState('');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadData = () => {
    setLoading(true);
    setError('');
    getMasterDataList()
      .then(res => {
        setItems(res.data || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to load master data');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter(
    item =>
      item.category === activeTab &&
      item.value.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleOpenAdd = () => {
    setDialogItem(null);
    setFormValue('');
    setDialogError('');
    setShowDialog(true);
  };

  const handleOpenEdit = (item) => {
    setDialogItem(item);
    setFormValue(item.value);
    setDialogError('');
    setShowDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) {
      setDialogError('Value cannot be empty');
      return;
    }

    setDialogLoading(true);
    setDialogError('');

    try {
      if (dialogItem) {
        // Edit mode
        await updateMasterData(dialogItem._id, formValue.trim());
      } else {
        // Add mode
        await createMasterData(activeTab, formValue.trim());
      }
      loadData();
      setShowDialog(false);
    } catch (err) {
      setDialogError(err.message || 'Operation failed');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteMasterData(itemToDelete._id);
      loadData();
      setItemToDelete(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete item');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const nextActive = item.isActive === false ? true : false;
      await updateMasterData(item._id, { isActive: nextActive });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2" style={{ fontFamily: 'Manrope,sans-serif' }}>
            <Database className="w-5 h-5 text-gold" style={{ color: '#D4AF37' }} />
            Master Data Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-1">
            Centralized settings to manage localities, cities, amenities, and property types dynamic options.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy transition-all shrink-0 cursor-pointer shadow-md hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1 border-b border-gray-250 dark:border-white/10 pb-px overflow-x-auto no-scrollbar whitespace-nowrap w-full">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveTab(cat.key);
              setSearch('');
            }}
            className={`px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all duration-200 shrink-0 cursor-pointer ${
              activeTab === cat.key
                ? 'border-gold text-gold-dark dark:text-gold font-extrabold'
                : 'border-transparent text-gray-400 dark:text-white/40 hover:text-navy dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'propertyType' ? 'property types' : activeTab + 's'}...`}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest text-right">
          Total items: {filteredItems.length}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold" style={{ color: '#D4AF37' }} />
          <p className="text-xs text-gray-400 dark:text-white/40 font-semibold uppercase tracking-wider">Syncing Master Data...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs text-center">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/2">
          <Database className="w-8 h-8 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-navy dark:text-white">No items found</p>
          <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
            {search ? 'Try adjusting your search keywords.' : 'Add your first item using the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {filteredItems.map(item => (
            <div
              key={item._id}
              className="p-3 sm:p-4 bg-white dark:bg-[#0E1A2B] border border-gray-150 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm hover:border-gold/30 transition-all duration-200 flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 transition-colors group-hover:bg-gold/10 flex items-center justify-center shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-navy dark:text-white text-xs sm:text-sm block leading-tight truncate" title={item.value}>
                    {item.value}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold border transition-all cursor-pointer ${
                      item.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-gray-150 text-gray-500 dark:bg-white/5 dark:text-white/40 border-gray-200 dark:border-white/10'
                    }`}
                    title={item.isActive !== false ? "Click to Deactivate" : "Click to Activate"}
                  >
                    <span className={`w-1 h-1 rounded-full ${item.isActive !== false ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-white/30'}`} />
                    {item.isActive !== false ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0 opacity-80 sm:opacity-60 group-hover:opacity-100">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gold dark:hover:text-gold transition-colors cursor-pointer"
                  title="Edit Value"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* CRUD Overlay Dialog Form */}
      {createPortal(
        <AnimatePresence>
          {showDialog && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !dialogLoading && setShowDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white dark:bg-[#0E1A2B] border border-transparent dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden z-10 transition-colors duration-300"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
                <h3 className="font-bold text-navy dark:text-white text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
                  {dialogItem ? 'Edit Item' : `Add to ${CATEGORIES.find(c => c.key === activeTab)?.label}`}
                </h3>
                <button
                  disabled={dialogLoading}
                  onClick={() => setShowDialog(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-white/50" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {dialogError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-500 rounded-xl text-xs">
                    {dialogError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-1.5">
                    Value / Name
                  </label>
                  <input
                    type="text"
                    disabled={dialogLoading}
                    value={formValue}
                    onChange={e => setFormValue(e.target.value)}
                    placeholder="e.g. Kalyani Nagar, Infinity Pool, Villa..."
                    className="w-full px-4 py-3 rounded-xl text-xs border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-gold transition-colors"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={dialogLoading}
                    onClick={() => setShowDialog(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-250 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={dialogLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                  >
                    {dialogLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : dialogItem ? (
                      'Save Changes'
                    ) : (
                      'Add Item'
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
      {/* Custom Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {itemToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#071A2F] border border-gray-150 dark:border-white/10 shadow-luxury text-left"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-base mb-2">Remove Item?</h3>
                <p className="text-xs text-ink-muted dark:text-white/60 leading-relaxed mb-4">
                  Are you sure you want to remove <span className="font-bold text-navy dark:text-white">"{itemToDelete.value}"</span>? This might affect properties referencing this value.
                </p>

                {deleteError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-450 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3.5 justify-end">
                  <button
                    type="button"
                    disabled={deleteLoading}
                    onClick={() => { setItemToDelete(null); setDeleteError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-250 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                      </>
                    ) : (
                      'Delete Item'
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
