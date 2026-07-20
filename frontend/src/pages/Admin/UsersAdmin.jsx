import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Briefcase, Users, Plus, X, Search, Phone, Mail, Trash2, Loader2, Pencil, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsers, createStaff, updateUserRole, deleteUser, getProperties } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';
import { SkeletonTable } from '../../components/common/Skeleton';

const ROLE_META = {
  admin: { label: 'Admin', color: '#8B5CF6', bg: '#F5F3FF', darkBg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.15)', icon: Crown },
  management: { label: 'Management', color: '#D4AF37', bg: '#FFFDF5', darkBg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.15)', icon: Briefcase },
  agent: { label: 'Agent', color: '#0EA5E9', bg: '#F0F9FF', darkBg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.15)', icon: Users },
  client: { label: 'Client', color: '#6B7280', bg: '#F3F4F6', darkBg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.15)', icon: Users }
};

const STAFF_ROLES = ['agent', 'management', 'admin'];

const LOCALITIES = [
  'Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi',
  'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner',
  'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road',
  'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate',
  'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav',
  'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi',
  'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar',
  'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari',
  'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi',
  'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'
].sort();

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
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-left transition-colors duration-200 focus:outline-none focus:border-gold/50 ${className}`}
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


function MultiSelectLocalities({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = useMemo(() => {
    if (!value) return [];
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }, [value]);

  const handleToggle = (locality) => {
    let next;
    if (selected.includes(locality)) {
      next = selected.filter(s => s !== locality);
    } else {
      next = [...selected, locality];
    }
    onChange(next.join(', '));
  };

  const filteredLocalities = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return LOCALITIES;
    return LOCALITIES.filter(l => l.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-left transition-colors duration-200 focus:outline-none focus:border-gold/50"
      >
        <span className={selected.length > 0 ? "text-navy dark:text-white font-medium truncate pr-2" : "text-gray-400 dark:text-white/30"}>
          {selected.length > 0 ? selected.join(', ') : 'Select localities'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {selected.length > 0 && (
            <span className="text-[10px] bg-gold/15 text-gold-dark dark:text-gold px-2 py-0.5 rounded-full font-extrabold">
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 max-h-64 overflow-y-auto bg-white/95 dark:bg-[#0E1A2B]/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 p-2.5 flex flex-col gap-2.5"
          >
            <input
              type="text"
              placeholder="Search locality..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-150 dark:border-white/10 bg-white dark:bg-[#071A2F] text-navy dark:text-white focus:outline-none focus:border-gold/50"
            />

            <div className="overflow-y-auto max-h-44 pr-1 space-y-0.5 no-scrollbar">
              {filteredLocalities.length === 0 ? (
                <p className="text-[11px] text-gray-400 dark:text-white/30 text-center py-3">No matching localities</p>
              ) : (
                filteredLocalities.map((loc) => {
                  const isChecked = selected.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleToggle(loc)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${isChecked
                        ? 'bg-gold/10 text-gold-dark dark:text-gold'
                        : 'text-gray-700 dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                        }`}
                    >
                      <span>{loc}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-gray-300 dark:border-white/10 text-gold focus:ring-gold/30 h-3.5 w-3.5 cursor-pointer accent-gold"
                      />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddStaffModal({ onAdd, onClose }) {
  const { user: loggedInUser } = useAdmin();
  const isManager = loggedInUser?.role === 'management';
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    role: isManager ? 'agent' : 'management', 
    department: '', 
    expertise: '', 
    qualities: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.role) {
      setError('Name, phone and role are required'); return;
    }
    setError('');
    setLoading(true);
    const payload = { ...form };
    if (payload.role !== 'agent') {
      payload.expertise = '';
      payload.qualities = '';
    }
    try { await onAdd(payload); onClose(); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-gray-150 dark:border-white/10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Add Staff Member</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        <div className="space-y-4 mb-5">
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Email (opt)', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input type={type} value={form[key]}
                placeholder={`Enter member's ${key}`}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}

          {form.role === 'agent' && (
            <>
              <div>
                <label className={labelCls}>Expertise (Localities)</label>
                <MultiSelectLocalities
                  value={form.expertise}
                  onChange={val => setForm(p => ({ ...p, expertise: val }))}
                />
              </div>
              <div>
                <label className={labelCls}>Agent Qualities / Skills</label>
                <input type="text" value={form.qualities}
                  placeholder="e.g. Luxury Specialist, Negotiator..."
                  onChange={e => setForm(p => ({ ...p, qualities: e.target.value }))}
                  className={inputCls} />
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Role</label>
            <CustomSelect
              value={form.role}
              onChange={val => setForm(p => ({ ...p, role: val }))}
              placeholder="Select role"
              options={isManager ? [
                { value: 'agent', label: 'Agent' }
              ] : STAFF_ROLES.filter(r => r !== 'admin').map(r => ({ value: r, label: ROLE_META[r].label }))}
              className={isManager ? "pointer-events-none opacity-60" : ""}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-xs mb-4 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/15">{error}</p>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-xs font-bold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer">Cancel</button>
          <button onClick={handleAdd} disabled={loading}
            className="flex-1 py-3 rounded-2xl text-xs font-black text-navy disabled:opacity-50 cursor-pointer shadow-lg shadow-gold/15"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading ? 'Adding…' : 'Add Staff'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersAdmin() {
  const { user } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deletingUser, setDeletingUser] = useState(false);

  const isDark = document.documentElement.classList.contains('dark');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAddStaff = async (body) => {
    await createStaff(body);
    await load();
  };

  const handleEditStaff = async (userId, body) => {
    await updateUserRole(userId, body);
    await load();
  };


  const handleToggleActive = async (u) => {
    setUpdating(u.id);
    try {
      await updateUserRole(u.id, { isActive: !u.isActive });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isActive: !x.isActive } : x));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    setDeleteError('');
    try {
      await deleteUser(userToDelete.id);
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      setDeleteError('');
    } catch (err) {
      console.error("Delete user failed:", err);
      setDeleteError(err.message || 'Failed to delete staff member');
    } finally {
      setDeletingUser(false);
    }
  };

  const staffUsers = users.filter(u => u.role !== 'client');

  const selfUser = staffUsers.find(u => u.id === user?.id || u.id === user?._id);

  const visibleStaff = staffUsers.filter(u => {
    // 1. Exclude self from the main directory list
    if (u.id === user?.id || u.id === user?._id) return false;

    // 2. Managers can only see Agents
    if (user?.role === 'management') {
      return u.role === 'agent';
    }

    // 3. Admins see everyone except themselves
    return true;
  });

  const filtered = visibleStaff.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const visibleRoles = user?.role === 'management' ? ['agent'] : ['agent', 'management', 'admin'];

  const roleCounts = visibleRoles.reduce((acc, r) => {
    acc[r] = visibleStaff.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <div className="pb-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Staff Directory</h1>
          <p className="text-gray-500 dark:text-white/40 text-sm">
            {user?.role === 'management' 
              ? `${visibleStaff.length} active agents`
              : `${visibleStaff.length} active team members`
            }
          </p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-navy hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer shadow-md shadow-gold/15"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 ${visibleRoles.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-1 max-w-sm'} gap-4 mb-6`}>
        {visibleRoles.map(r => {
          const m = ROLE_META[r];
          const isActive = roleFilter === r;
          const CardIcon = m.icon;
          return (
            <button key={r} onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
              className={`relative rounded-3xl p-5 text-left border transition-all duration-300 hover:scale-[1.01] hover:shadow-md overflow-hidden group ${isActive
                  ? 'border-transparent shadow-sm'
                  : 'border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B]'
                }`}
              style={{
                backgroundColor: isActive
                  ? (isDark ? `${m.color}20` : `${m.bg}`)
                  : (isDark ? '#0E1A2B' : '#FFF'),
                borderColor: isActive ? m.color : undefined,
                borderWidth: '1.5px',
              }}>
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: m.color }} />

              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: m.color }} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-white/30">{m.label} Accounts</span>
                  </div>
                  <p className="text-4xl font-black" style={{ color: isDark ? '#FFF' : '#071A2F', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {roleCounts[r] || 0}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <CardIcon className="w-5 h-5" style={{ color: m.color }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3.5 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search team members by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-11 py-0 rounded-2xl border border-gray-150 dark:border-white/10 bg-white dark:bg-[#0E1A2B] text-sm text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors shadow-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25">
            <Search className="w-4 h-4" />
          </span>
        </div>

        <div className="w-full sm:w-48">
          <CustomSelect
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="All Roles"
            options={user?.role === 'management' ? [
              { value: 'all', label: 'All Roles' },
              { value: 'agent', label: 'Agent' }
            ] : [
              { value: 'all', label: 'All Roles' },
              { value: 'agent', label: 'Agent' },
              { value: 'management', label: 'Management' },
              { value: 'admin', label: 'Admin' }
            ]}
          />
        </div>
      </div>

      {/* Logged In User's Own Profile Card (Self) */}
      {selfUser && (
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-gold/5 via-gold-light/0 to-transparent border border-gold/15 dark:border-gold/25 relative overflow-hidden bg-white dark:bg-[#0E1A2B] transition-all">
          <div className="absolute top-0 right-0 px-3.5 py-1 bg-gold/15 dark:bg-gold/20 border-l border-b border-gold/15 text-gold-dark dark:text-gold text-[9px] font-black uppercase tracking-wider rounded-bl-2xl">
            Your Profile (Self)
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {(() => {
                const meta = ROLE_META[selfUser.role] || ROLE_META.agent;
                return (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0"
                    style={{ background: meta.darkBg, color: meta.color, border: `1.5px solid ${meta.border}` }}>
                    {selfUser.name.charAt(0).toUpperCase()}
                  </div>
                );
              })()}
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-extrabold text-base text-navy dark:text-white leading-none">{selfUser.name}</h3>
                  {(() => {
                    const meta = ROLE_META[selfUser.role] || ROLE_META.agent;
                    const Icon = meta.icon;
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                        <Icon className="w-2.5 h-2.5" />
                        {meta.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex flex-wrap gap-4 mt-2.5 text-xs text-gray-500 dark:text-white/40 font-medium">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selfUser.phone}</span>
                  {selfUser.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selfUser.email}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingUser(selfUser)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold text-navy dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="p-4 space-y-4">
            <div className="hidden lg:block">
              <SkeletonTable rows={5} cols={5} />
            </div>
            <div className="block lg:hidden space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-navy-light border border-gray-100 dark:border-white/5 flex gap-3 animate-pulse">
                  <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="h-4.5 w-full bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-200 dark:text-white/10 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-white/30 text-sm">No team members match search query</p>
          </div>
        ) : (
          <div className="w-full">
            {/* MOBILE LAYOUT: Flex cards stack */}
            <div className="block lg:hidden space-y-4">
              {filtered.map(u => {
                const isUpdating = updating === u.id;
                const roleMeta = ROLE_META[u.role] || ROLE_META.agent;
                const RoleIcon = roleMeta.icon;
                const dateStr = new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                return (
                  <div key={u.id} className={`p-4 rounded-2xl bg-white dark:bg-navy-light border transition-all flex flex-col gap-3 relative shadow-card ${!u.isActive ? 'opacity-55' : ''}`}
                    style={u.role === 'admin' ? { background: 'rgba(139,92,246,0.02)', borderLeft: '4px solid rgba(139,92,246,0.45)', borderColor: 'rgba(139,92,246,0.08)' } : u.role === 'management' ? { background: 'rgba(212,175,55,0.02)', borderLeft: '4px solid rgba(212,175,55,0.45)', borderColor: 'rgba(212,175,55,0.08)' } : { borderLeft: '4px solid transparent', borderColor: 'rgba(255,255,255,0.05)' }}>

                    {/* Header Row: Name & Role Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                          style={{ background: roleMeta.darkBg, color: roleMeta.color, border: `1.5px solid ${roleMeta.border}` }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-navy dark:text-white text-sm truncate">{u.name}</p>
                          {u.email && <p className="text-[10px] text-gray-400 dark:text-white/30 truncate flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{u.email}</p>}
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
                        style={{ background: roleMeta.bg, color: roleMeta.color, border: `1.5px solid ${roleMeta.border}` }}>
                        <RoleIcon className="w-3 h-3" />
                        {roleMeta.label}
                      </span>
                    </div>

                    {/* Info Block (Expertise, Qualities, Phone) */}
                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-gray-100 dark:border-white/5 py-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-white/20 tracking-wider">Contact Info</span>
                        <p className="font-semibold text-navy dark:text-white/75 truncate flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" />{u.phone}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-white/20 tracking-wider">Localities</span>
                        <p className="font-semibold text-navy dark:text-white/75 truncate">{u.expertise || 'None'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-white/20 tracking-wider">Qualities</span>
                        <p className="font-semibold text-navy dark:text-white/75 truncate">{u.qualities || 'None'}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 dark:text-white/20 tracking-wider">Joined</span>
                        <p className="font-medium text-gray-500 dark:text-white/40">{dateStr}</p>
                      </div>
                    </div>

                    {/* Bottom Row: Active Toggle, Stats & Actions */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-3.5">
                        {/* Properties count */}
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-500/10 text-blue-500">
                          {u.propertiesCount || 0} Prop
                        </span>

                        {/* Toggle active */}
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleActive(u)} disabled={isUpdating}
                            className={`w-9 h-5 rounded-full transition-all duration-200 relative disabled:opacity-50 cursor-pointer ${u.isActive ? 'bg-green-500 shadow-sm' : 'bg-gray-200 dark:bg-white/10'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${u.isActive ? 'left-[18px]' : 'left-0.5'}`} />
                          </button>
                          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-500 shrink-0" />}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {u.id !== user?.id ? (
                          <>
                            <button onClick={() => setViewingUser(u)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer" title="View Workspace">
                              <Users className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingUser(u)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer" title="Edit Member">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setUserToDelete(u)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Delete Member">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gold/10 text-gold-dark dark:text-gold border border-gold/15">
                            Self
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP LAYOUT: Traditional Table */}
            <div className="hidden lg:block overflow-x-auto w-full">
              <table className="min-w-[1200px] w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/10 text-[10px] font-extrabold text-gray-400 dark:text-white/30 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Name</th>
                    <th className="px-6 py-3.5">Contact Info</th>
                    <th className="px-6 py-3.5">Access Role</th>
                    <th className="px-6 py-3.5">Expertise Localities</th>
                    <th className="px-6 py-3.5">Agent Qualities</th>
                    <th className="px-6 py-3.5 text-center">Properties</th>
                    <th className="px-6 py-3.5">Joined</th>
                    <th className="px-6 py-3.5">Active</th>
                    <th className="px-6 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {filtered.map(u => {
                    const isUpdating = updating === u.id;
                    return (
                      <tr key={u.id} className={`transition-colors ${!u.isActive ? 'opacity-50' : ''}`}
                        style={u.role === 'admin' ? { background: 'rgba(139,92,246,0.045)', borderLeft: '3px solid rgba(139,92,246,0.45)' } : u.role === 'management' ? { background: 'rgba(212,175,55,0.045)', borderLeft: '3px solid rgba(212,175,55,0.45)' } : { borderLeft: '3px solid transparent' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const m = ROLE_META[u.role] || ROLE_META.agent; return (
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                                  style={{ background: m.darkBg, color: m.color, border: `1.5px solid ${m.border}` }}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>);
                            })()}
                            <div className="min-w-0">
                              <p className="font-bold text-navy dark:text-white text-sm truncate max-w-[160px]">{u.name}</p>
                              {u.email && <p className="text-[10px] text-gray-400 dark:text-white/30 truncate max-w-[160px] flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-gray-455 dark:text-white/20" />{u.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-xs text-gray-650 dark:text-white/55 font-bold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-455 dark:text-white/20" />{u.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const meta = ROLE_META[u.role] || ROLE_META.agent;
                            const Icon = meta.icon;
                            return (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.border}` }}>
                                <Icon className="w-3 h-3" />
                                {meta.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          {u.expertise ? (
                            <span className="truncate block max-w-[170px] text-xs font-semibold text-navy dark:text-white" title={u.expertise}>
                              {u.expertise}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-white/20 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {u.qualities ? (
                            <span className="truncate block max-w-[170px] text-xs font-semibold text-navy dark:text-white" title={u.qualities}>
                              {u.qualities}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-white/20 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-500">
                            {u.propertiesCount || 0} Prop
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-455 dark:text-white/35 font-medium">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleActive(u)} disabled={isUpdating}
                              className={`w-9 h-5 rounded-full transition-all duration-200 relative disabled:opacity-50 cursor-pointer ${u.isActive ? 'bg-green-500 shadow-sm' : 'bg-gray-200 dark:bg-white/10'}`}>
                              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${u.isActive ? 'left-[18px]' : 'left-0.5'}`} />
                            </button>
                            {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-500 shrink-0" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {u.id !== user?.id ? (
                              <>
                                <button onClick={() => setViewingUser(u)}
                                  className="p-2 rounded-xl text-gray-405 hover:text-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="View Workspace">
                                  <Users className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingUser(u)}
                                  className="p-2 rounded-xl text-gray-405 hover:text-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Edit Member">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setUserToDelete(u)}
                                  className="p-2 rounded-xl text-gray-405 hover:text-red-500 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer" title="Delete Member">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md bg-gold/10 text-gold-dark dark:text-gold border border-gold/15 shadow-sm">
                                Self
                              </span>
                            )}
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
        <AddStaffModal onAdd={handleAddStaff} onClose={() => setShowAdd(false)} />
      )}

      {editingUser && (
        <EditStaffModal
          user={editingUser}
          onSave={handleEditStaff}
          onClose={() => setEditingUser(null)}
        />
      )}

      {viewingUser && (
        <AgentDetailsModal
          agent={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {userToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#071A2F] border border-gray-150 dark:border-white/10 shadow-luxury text-left animate-fade-in"
              >
                <h3 className="font-display font-black text-navy dark:text-white text-base mb-2">Remove Staff Account?</h3>
                <p className="text-xs text-ink-muted dark:text-white/60 leading-relaxed mb-4">
                  Are you sure you want to remove <span className="font-bold text-navy dark:text-white">{userToDelete.name}</span>? This will permanently delete their staff account.
                </p>

                {deleteError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {deleteError}
                  </div>
                )}

                <div className="flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => { setUserToDelete(null); setDeleteError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    disabled={deletingUser}
                    className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-655 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {deletingUser ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…
                      </>
                    ) : (
                      'Delete Account'
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

function EditStaffModal({ user, onSave, onClose }) {
  const { user: loggedInUser } = useAdmin();
  const isManager = loggedInUser?.role === 'management';
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email || '',
    role: user.role,
    expertise: user.expertise || '',
    qualities: user.qualities || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.role) {
      setError('Name, phone and role are required'); return;
    }
    setError('');
    setLoading(true);
    const payload = { ...form };
    if (payload.role !== 'agent') {
      payload.expertise = '';
      payload.qualities = '';
    }
    try {
      await onSave(user.id, payload);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-gray-150 dark:border-white/10 transition-colors duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Edit Staff Member</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-500/10 p-2.5 rounded-xl mb-4 font-semibold">{error}</p>}

        <div className="space-y-4 mb-5">
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'tel' },
            { label: 'Email', key: 'email', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input type={type} value={form[key]}
                placeholder={`Enter member's ${key}`}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className={inputCls} />
            </div>
          ))}

          {form.role === 'agent' && (
            <>
              <div>
                <label className={labelCls}>Expertise (Localities)</label>
                <MultiSelectLocalities
                  value={form.expertise}
                  onChange={val => setForm(p => ({ ...p, expertise: val }))}
                />
              </div>
              <div>
                <label className={labelCls}>Agent Qualities / Skills</label>
                <input type="text" value={form.qualities}
                  placeholder="e.g. Luxury Specialist, Negotiator..."
                  onChange={e => setForm(p => ({ ...p, qualities: e.target.value }))}
                  className={inputCls} />
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Role</label>
            <CustomSelect
              value={form.role}
              onChange={val => setForm(p => ({ ...p, role: val }))}
              placeholder="Select role"
              options={isManager ? [
                { value: 'agent', label: 'Agent' }
              ] : STAFF_ROLES.filter(r => r !== 'admin' || user.role === 'admin').map(r => ({ value: r, label: ROLE_META[r].label }))}
              className={isManager ? "pointer-events-none opacity-60" : ""}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-navy hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function AgentDetailsModal({ agent, onClose }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const pData = await getProperties({ limit: 100 });
        setProperties((pData.properties || []).filter(p => p.agent?.id === agent.id));
      } catch (err) {
        console.error("Failed to load properties", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [agent]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col border border-gray-150 dark:border-white/10 transition-colors duration-300 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="font-bold text-navy dark:text-white text-base" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            Agent Profile Workspace
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400 dark:text-white/40" />
          </button>
        </div>

        {/* Profile Banner */}
        <div className="bg-gray-50/50 dark:bg-white/[0.01] px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0"
            style={{
              background: 'linear-gradient(135deg, #071A2F 0%, #1e3a5f 100%)',
              color: '#D4AF37',
              border: '1.5px solid rgba(212, 175, 55, 0.15)'
            }}>
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-navy dark:text-white text-base truncate leading-snug">{agent.name}</h4>
            <p className="text-xs text-gray-405 dark:text-white/35 truncate mt-0.5">{agent.email || 'No email registered'}</p>
            <p className="text-[10px] text-gray-500 dark:text-white/40 font-bold mt-1 uppercase tracking-wider">{ROLE_META[agent.role]?.label || agent.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-black text-navy dark:text-white">{agent.phone}</p>
            {agent.expertise && <p className="text-[10px] font-semibold text-gold mt-1" style={{ color: '#D4AF37' }}>Areas: {agent.expertise}</p>}
            {agent.qualities && <p className="text-[9px] font-bold text-cyan-500 dark:text-cyan-400 mt-0.5">Qualities: {agent.qualities}</p>}
          </div>
        </div>

        {/* Content Workspace */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gold" style={{ color: '#D4AF37' }} />
            </div>
          ) : (
            <div>
              {/* Properties Section */}
              <h5 className="font-extrabold text-navy dark:text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Properties Portfolio ({properties.length})
              </h5>
              {properties.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-white/20 italic p-3 bg-gray-50 dark:bg-white/[0.01] rounded-xl border border-transparent dark:border-white/5">No properties assigned</p>
              ) : (
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                  {properties.map(p => (
                    <div key={p._id} className="p-3 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform">
                      <div className="min-w-0">
                        <p className="font-bold text-navy dark:text-white text-xs truncate">{p.title}</p>
                        <p className="text-[9px] text-gray-400 dark:text-white/30 truncate mt-0.5">{p.location}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-black text-navy dark:text-white">{p.priceLabel || `₹${(p.price / 10000000).toFixed(1)}Cr`}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/10 text-right">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-navy dark:text-white bg-white dark:bg-[#071A2F] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors shadow-sm">
            Close Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
