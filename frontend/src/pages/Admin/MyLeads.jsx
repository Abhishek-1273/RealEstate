import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnquiries, updateStatus } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';

const STATUS_COLOR = {
  new:       { bg: '#DBEAFE', text: '#1E40AF', darkBg: 'rgba(30,64,175,0.18)',  darkText: '#93B4F7' },
  contacted: { bg: '#FEF9C3', text: '#854D0E', darkBg: 'rgba(133,77,14,0.18)', darkText: '#FBD07A' },
  visited:   { bg: '#EDE9FE', text: '#5B21B6', darkBg: 'rgba(91,33,182,0.18)', darkText: '#C4B5FD' },
  qualified: { bg: '#D1FAE5', text: '#065F46', darkBg: 'rgba(6,95,70,0.18)',   darkText: '#6EE7B7' },
  converted: { bg: '#DCFCE7', text: '#14532D', darkBg: 'rgba(20,83,45,0.18)',  darkText: '#86EFAC' },
  lost:      { bg: '#FEE2E2', text: '#7F1D1D', darkBg: 'rgba(127,29,29,0.18)', darkText: '#FCA5A5' },
};

const STATUSES_ALL = ['new', 'contacted', 'visited', 'qualified', 'converted', 'lost'];

function CustomSelect({ value, onChange, options, placeholder, className = "", disabled }) {
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
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-left transition-colors duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 disabled:opacity-60 ${className}`}
      >
        <span className={value ? "text-navy dark:text-white capitalize" : "text-gray-400 dark:text-white/25"}>
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
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between capitalize ${
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

function LeadCard({ lead, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const sc = STATUS_COLOR[lead.status] || STATUS_COLOR.new;
  const isDark = document.documentElement.classList.contains('dark');

  const handleStatus = async (s) => {
    if (s === lead.status) return;
    setLoading(true);
    try { await onStatusChange(lead._id, s); }
    catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 hover:shadow-md dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            style={{ background: '#EEF2FF', color: '#3730A3', fontFamily: 'Manrope,sans-serif' }}>
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-navy dark:text-white text-sm truncate">{lead.name}</p>
            <p className="text-[11px] text-gray-400 dark:text-white/35">{lead.phone}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full capitalize shrink-0"
          style={{ background: isDark ? sc.darkBg : sc.bg, color: isDark ? sc.darkText : sc.text }}>
          {lead.status}
        </span>
      </div>

      {/* Type + date */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded capitalize"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6', color: isDark ? 'rgba(255,255,255,0.6)' : '#374151' }}>
          {lead.type}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-white/30">
          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
        </span>
        {lead.followUps?.length > 0 && (
          <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded ml-auto">
            {lead.followUps.length} notes
          </span>
        )}
      </div>

      {/* Status update */}
      <div className="mb-4">
        <label className="block text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5">Update Status</label>
        <div className="relative">
          {loading ? (
            <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-400 dark:text-white/20 select-none">
              <span className="capitalize">{lead.status}</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
          ) : (
            <CustomSelect
              value={lead.status}
              onChange={handleStatus}
              options={STATUSES_ALL}
              placeholder="Select Status"
              disabled={loading}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a href={`tel:${lead.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all hover:opacity-90"
          style={{ background: '#DCFCE7', color: '#065F46' }}>
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
        <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all hover:opacity-90"
          style={{ background: '#D1FAE5', color: '#065F46' }}>
          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <Link to={`/admin/leads/${lead._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all hover:opacity-90"
          style={{ background: '#EEF2FF', color: '#3730A3' }}>
          View
        </Link>
      </div>
    </div>
  );
}

export default function MyLeads() {
  const { user } = useAdmin();
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      const data = await getEnquiries(params);
      setLeads(data.enquiries);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (leadId, newStatus) => {
    await updateStatus(leadId, newStatus);
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
  };

  const counts = STATUSES_ALL.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  const summary = [
    { label: 'Total',     value: leads.length,                                                                    color: '#6366F1' },
    { label: 'New',       value: counts.new || 0,                                                                 color: '#1E40AF' },
    { label: 'Active',    value: (counts.contacted || 0) + (counts.visited || 0) + (counts.qualified || 0),       color: '#D4AF37' },
    { label: 'Converted', value: counts.converted || 0,                                                           color: '#059669' },
  ];

  const displayedLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>
          My Leads
        </h1>
        <p className="text-gray-500 dark:text-white/40 text-sm">Welcome back, {user?.name?.split(' ')[0]}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {summary.map(s => (
          <div key={s.label} className="bg-white dark:bg-[#0E1A2B] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm text-center transition-colors duration-300">
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color, fontFamily: 'Manrope,sans-serif' }}>{s.value}</p>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-5 pb-1">
        {['all', ...STATUSES_ALL].map(s => {
          const count = s === 'all' ? leads.length : (counts[s] || 0);
          const isActive = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 capitalize border"
              style={{
                background: isActive ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'transparent',
                color:      isActive ? '#071A2F' : 'rgba(156,163,175,1)',
                border:     isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                boxShadow:  isActive ? '0 2px 8px rgba(212,175,55,0.2)' : 'none',
              }}>
              {s === 'all' ? 'All' : s}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-black/10 text-navy' : 'bg-white/10 text-white/50'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lead cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#D4AF37' }} />
        </div>
      ) : displayedLeads.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 transition-colors duration-300">
          <CheckCircle className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/30 text-sm">
            {filter === 'all' ? 'No leads assigned yet' : `No ${filter} leads`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedLeads.map(lead => (
            <LeadCard key={lead._id} lead={lead} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
