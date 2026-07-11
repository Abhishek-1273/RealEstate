import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, Loader2, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnquiries, getUsers, assignLead } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';

const STATUS_COLOR = {
  new:       { bg: '#DBEAFE', text: '#1E40AF', darkBg: 'rgba(30,64,175,0.18)',  darkText: '#93B4F7' },
  contacted: { bg: '#FEF9C3', text: '#854D0E', darkBg: 'rgba(133,77,14,0.18)', darkText: '#FBD07A' },
  visited:   { bg: '#EDE9FE', text: '#5B21B6', darkBg: 'rgba(91,33,182,0.18)', darkText: '#C4B5FD' },
  qualified: { bg: '#D1FAE5', text: '#065F46', darkBg: 'rgba(6,95,70,0.18)',   darkText: '#6EE7B7' },
  converted: { bg: '#DCFCE7', text: '#14532D', darkBg: 'rgba(20,83,45,0.18)',  darkText: '#86EFAC' },
  lost:      { bg: '#FEE2E2', text: '#7F1D1D', darkBg: 'rgba(127,29,29,0.18)' ,darkText: '#FCA5A5' },
};

const TYPE_COLOR = {
  contact:    '#6366F1',
  buy:        '#D4AF37',
  sell:       '#F59E0B',
  lease:      '#0891B2',
  management: '#7C3AED',
  newsletter: '#059669',
};

const STATUSES = ['all', 'new', 'contacted', 'visited', 'qualified', 'converted', 'lost'];
const TYPES    = ['all', 'contact', 'buy', 'sell', 'lease', 'management', 'newsletter'];

function AssignModal({ lead, employees, onAssign, onClose }) {
  const [selected, setSelected] = useState(lead.assignedTo?._id || '');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const emp = employees.find(e => e.id === selected);
      await onAssign(lead._id, selected, emp?.name || '');
      onClose();
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-transparent dark:border-white/10 transition-colors duration-300">
        <h3 className="font-bold text-navy dark:text-white text-base mb-1" style={{ fontFamily: 'Manrope,sans-serif' }}>
          Assign Lead
        </h3>
        <p className="text-xs text-gray-500 dark:text-white/40 mb-4">{lead.name} · {lead.phone}</p>

        <div className="space-y-2 mb-5 max-h-56 overflow-y-auto">
          {employees.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-white/30 text-center py-4">No employees found</p>
          ) : employees.map(emp => (
            <label key={emp.id}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                selected === emp.id
                  ? 'border-yellow-400 bg-yellow-400/5 dark:border-yellow-400/50 dark:bg-yellow-400/10'
                  : 'border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
              }`}>
              <input type="radio" name="emp" value={emp.id}
                checked={selected === emp.id}
                onChange={() => setSelected(emp.id)}
                className="accent-yellow-500" />
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: '#EEF2FF', color: '#3730A3' }}>
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">{emp.name}</p>
                <p className="text-[11px] text-gray-400 dark:text-white/35">{emp.department || 'Employee'}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={handleAssign} disabled={!selected || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-navy transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading ? 'Assigning…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

export default function LeadsList() {
  const { isLeadCtrl } = useAdmin();

  const [leads,     setLeads]     = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [total,     setTotal]     = useState(0);

  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('all');
  const [type,      setType]      = useState('all');
  const [assigningLead, setAssigningLead] = useState(null);

  const isDark = document.documentElement.classList.contains('dark');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 60 };
      if (status !== 'all') params.status = status;
      if (type   !== 'all') params.type   = type;
      const data = await getEnquiries(params);
      let list = data.enquiries;
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(l =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.email || '').toLowerCase().includes(q)
        );
      }
      setLeads(list);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [status, type, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!isLeadCtrl) return;
    getUsers({ role: 'employee' }).then(d => {
      setEmployees(d.users.map(u => ({ id: u.id, name: u.name, department: u.department })));
    }).catch(() => {});
  }, [isLeadCtrl]);

  const handleAssign = async (leadId, empId, empName) => {
    await assignLead(leadId, empId, empName);
    setLeads(prev => prev.map(l =>
      l._id === leadId ? { ...l, assignedToName: empName, assignedTo: { _id: empId, name: empName } } : l
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>All Leads</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{total} total enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 mb-5 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, email…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/60 transition-all" />
          </div>
          <div className="flex gap-2 shrink-0">
            <CustomSelect
              value={status}
              onChange={val => setStatus(val)}
              placeholder="All Status"
              options={STATUSES.map(s => ({ value: s, label: s === 'all' ? 'All Status' : s }))}
              className="w-32 sm:w-36"
            />
            <CustomSelect
              value={type}
              onChange={val => setType(val)}
              placeholder="All Types"
              options={TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t }))}
              className="w-32 sm:w-36"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#D4AF37' }} />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-white/30 text-sm">No leads match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  {['Lead', 'Type', 'Status', 'Assigned To', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {leads.map(l => {
                  const sc = STATUS_COLOR[l.status] || STATUS_COLOR.new;
                  const tc = TYPE_COLOR[l.type]     || '#6B7280';
                  return (
                    <tr key={l._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: '#EEF2FF', color: '#3730A3' }}>
                            {l.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-navy dark:text-white text-sm truncate max-w-[140px]">{l.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-white/35">{l.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-bold px-2 py-1 rounded-full capitalize"
                          style={{ background: `${tc}18`, color: tc }}>
                          {l.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-bold px-2 py-1 rounded-full capitalize"
                          style={{ background: isDark ? sc.darkBg : sc.bg, color: isDark ? sc.darkText : sc.text }}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {l.assignedTo ? (
                          <span className="text-[12px] font-medium text-gray-600 dark:text-white/60">
                            {l.assignedTo.name || l.assignedToName}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-300 dark:text-white/20">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-gray-400 dark:text-white/30 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/leads/${l._id}`}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            style={{ color: '#4F46E5' }}>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {assigningLead && (
        <AssignModal
          lead={assigningLead}
          employees={employees}
          onAssign={handleAssign}
          onClose={() => setAssigningLead(null)}
        />
      )}
    </div>
  );
}
