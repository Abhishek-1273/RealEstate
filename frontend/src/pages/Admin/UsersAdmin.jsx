import { useState, useEffect, useRef } from 'react';
import { Plus, X, Loader2, Users, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsers, createStaff, updateUserRole } from '../../utils/adminApi';

const ROLE_META = {
  admin: { label: 'Admin', color: '#7C3AED', bg: '#F3E8FF', darkBg: 'rgba(124,58,237,0.15)' },
  management: { label: 'Management', color: '#D4AF37', bg: '#FFFBEB', darkBg: 'rgba(212,175,55,0.12)' },
  client: { label: 'Client', color: '#6B7280', bg: '#F3F4F6', darkBg: 'rgba(107,114,128,0.12)' },
};

const ROLES = ['client', 'management', 'admin'];
const DEPTS = ['Sales', 'Rentals', 'Property Management', 'Marketing', 'Operations', ''];
const STAFF_ROLES = ['management', 'admin'];

const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 transition-colors";
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
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-left transition-colors duration-200 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500/50 ${className}`}
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
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${active
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

function InlineRoleSelect({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const rm = ROLE_META[value] || ROLE_META.client;

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full cursor-pointer border-none focus:outline-none transition-all duration-200 select-none hover:brightness-95 disabled:opacity-50"
        style={{ background: isDark ? rm.darkBg : rm.bg, color: rm.color }}
      >
        <span>{rm.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute left-0 mt-1 min-w-[130px] bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-xl shadow-luxury z-50 py-1.5 no-scrollbar"
          >
            {ROLES.map((r) => {
              const active = value === r;
              const meta = ROLE_META[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onChange(r);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-gray-100/70 dark:bg-white/5'
                      : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    <span className="text-gray-750 dark:text-white/80">{meta.label}</span>
                  </div>
                  {active && <span className="text-[8px] text-gray-400">●</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddStaffModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'employee', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.role) {
      setError('Name, phone and role are required'); return;
    }
    setError('');
    setLoading(true);
    try { await onAdd(form); onClose(); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-transparent dark:border-white/10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Manrope,sans-serif' }}>Add Staff Member</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Email (opt)', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input type={type} value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}

          <div>
            <label className={labelCls}>Role</label>
            <CustomSelect
              value={form.role}
              onChange={val => setForm(p => ({ ...p, role: val }))}
              placeholder="Select role"
              options={STAFF_ROLES.map(r => ({ value: r, label: ROLE_META[r].label }))}
            />
          </div>

          <div>
            <label className={labelCls}>Department</label>
            <CustomSelect
              value={form.department}
              onChange={val => setForm(p => ({ ...p, department: val }))}
              placeholder="None"
              options={DEPTS.map(d => ({ value: d, label: d || 'None' }))}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-xs mb-3 px-3 py-2 rounded-xl"
            style={{ background: '#FEF2F2' }}>{error}</p>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={handleAdd} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-navy disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading ? 'Adding…' : 'Add Staff'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const isDark = document.documentElement.classList.contains('dark');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAddStaff = async (body) => {
    await createStaff(body);
    await load();
  };

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    try {
      await updateUserRole(userId, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const handleToggleActive = async (u) => {
    setUpdating(u.id);
    try {
      await updateUserRole(u.id, { isActive: !u.isActive });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isActive: !x.isActive } : x));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const filtered = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>Users</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">{users.length} total accounts</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-3.5 mb-6">
        {ROLES.map(r => {
          const m = ROLE_META[r];
          const isActive = roleFilter === r;
          return (
            <button key={r} onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
              className={`rounded-2xl py-4 px-4.5 text-left border transition-all duration-200 hover:scale-[1.02] ${
                isActive
                  ? 'border-transparent shadow-md'
                  : 'border-gray-100 dark:border-white/10 bg-white dark:bg-[#0E1A2B] hover:border-gray-200 dark:hover:border-white/20 shadow-sm'
              }`}
              style={{
                backgroundColor: isActive 
                  ? (isDark ? `${m.color}25` : `${m.bg}`)
                  : (isDark ? `${m.color}0D` : `${m.bg}60`),
                borderColor: isActive ? m.color : `${m.color}20`,
                borderWidth: '1.5px',
              }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-white/30 whitespace-nowrap">{m.label}</span>
              </div>
              <p className="text-3xl font-black pl-3.5" style={{ color: isDark ? '#FFF' : '#071A2F', fontFamily: 'Manrope,sans-serif' }}>
                {roleCounts[r] || 0}
              </p>
            </button>
          );
        })}
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#D4AF37' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-white/30 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10">
                  {['User', 'Phone', 'Role', 'Department', 'Joined', 'Active'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filtered.map(u => {
                  const rm = ROLE_META[u.role] || ROLE_META.client;
                  const isUpdating = updating === u.id;
                  return (
                    <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!u.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: isDark ? rm.darkBg : rm.bg, color: rm.color }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-navy dark:text-white text-sm truncate max-w-[140px]">{u.name}</p>
                            {u.email && <p className="text-[11px] text-gray-400 dark:text-white/35 truncate">{u.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-600 dark:text-white/55 whitespace-nowrap">{u.phone}</td>
                      <td className="px-5 py-3.5">
                        <InlineRoleSelect
                          value={u.role}
                          disabled={isUpdating}
                          onChange={val => handleRoleChange(u.id, val)}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-gray-500 dark:text-white/40">{u.department || '—'}</td>
                      <td className="px-5 py-3.5 text-[11px] text-gray-400 dark:text-white/30 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleActive(u)} disabled={isUpdating}
                            className={`w-10 h-5 rounded-full transition-all duration-200 relative disabled:opacity-50 ${u.isActive ? 'bg-green-400' : 'bg-gray-200 dark:bg-white/15'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${u.isActive ? 'left-5' : 'left-0.5'}`} />
                          </button>
                          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-500 shrink-0" />}
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

      {showAdd && (
        <AddStaffModal onAdd={handleAddStaff} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
