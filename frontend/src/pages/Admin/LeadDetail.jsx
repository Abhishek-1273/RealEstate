import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, User, MessageSquare, Loader2, Send, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnquiry, updateStatus, addFollowUp, assignLead, getUsers } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';

const STATUS_STEPS = ['new', 'contacted', 'visited', 'qualified', 'converted', 'lost'];

const STATUS_COLOR = {
  new:       { bg: '#DBEAFE', text: '#1E40AF', darkBg: 'rgba(30,64,175,0.2)',  darkText: '#93B4F7' },
  contacted: { bg: '#FEF9C3', text: '#854D0E', darkBg: 'rgba(133,77,14,0.2)', darkText: '#FBD07A' },
  visited:   { bg: '#EDE9FE', text: '#5B21B6', darkBg: 'rgba(91,33,182,0.2)', darkText: '#C4B5FD' },
  qualified: { bg: '#D1FAE5', text: '#065F46', darkBg: 'rgba(6,95,70,0.2)',   darkText: '#6EE7B7' },
  converted: { bg: '#DCFCE7', text: '#14532D', darkBg: 'rgba(20,83,45,0.2)',  darkText: '#86EFAC' },
  lost:      { bg: '#FEE2E2', text: '#7F1D1D', darkBg: 'rgba(127,29,29,0.2)' ,darkText: '#FCA5A5' },
};

const TYPE_FIELDS = {
  buy:        ['propertyType', 'locality', 'budget', 'timing'],
  sell:       ['propertyLocality', 'propertyArea', 'bedrooms', 'askingPrice', 'furnishing'],
  lease:      ['leasePurpose', 'rentRange', 'duration'],
  management: ['managementTier', 'numberOfProperties'],
  contact:    ['subject', 'message'],
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-gray-50 dark:border-white/5 last:border-0">
      <span className="text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wide w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-navy dark:text-white/80 font-medium">{value}</span>
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
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
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

export default function LeadDetail() {
  const { id } = useParams();
  const { isLeadCtrl, isStaff } = useAdmin();

  const [lead,      setLead]      = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [note,      setNote]      = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    getEnquiry(id)
      .then(d => setLead(d.enquiry))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
    if (isLeadCtrl) {
      getUsers({ role: 'employee' })
        .then(d => setEmployees(d.users))
        .catch(() => {});
    }
  }, [id, isLeadCtrl]);

  const handleStatus = async (s) => {
    if (s === lead.status) return;
    setStatusLoading(true);
    try {
      const d = await updateStatus(id, s);
      setLead(d.enquiry);
    } catch (e) { alert(e.message); }
    finally { setStatusLoading(false); }
  };

  const handleFollowUp = async () => {
    if (!note.trim()) return;
    setNoteLoading(true);
    try {
      const d = await addFollowUp(id, note.trim());
      setLead(d.enquiry);
      setNote('');
    } catch (e) { alert(e.message); }
    finally { setNoteLoading(false); }
  };

  const handleAssign = async (val) => {
    const empId = typeof val === 'object' && val && 'target' in val ? val.target.value : val;
    const emp   = employees.find(u => u.id === empId);
    if (!empId) return;
    try {
      const d = await assignLead(id, empId, emp?.name || '');
      setLead(d.enquiry);
    } catch (e) { alert(e.message); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#D4AF37' }} />
    </div>
  );

  if (!lead) return (
    <div className="text-center py-20 text-gray-400 dark:text-white/30">Lead not found</div>
  );

  const sc = STATUS_COLOR[lead.status] || STATUS_COLOR.new;
  const fields = TYPE_FIELDS[lead.type] || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link to="/admin/leads" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/40 hover:text-navy dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Header card */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 mb-5 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0"
              style={{ background: '#EEF2FF', color: '#3730A3', fontFamily: 'Manrope,sans-serif' }}>
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-navy dark:text-white" style={{ fontFamily: 'Manrope,sans-serif' }}>{lead.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/45 hover:text-navy dark:hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {lead.phone}
                </a>
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/45 hover:text-navy dark:hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {lead.email}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
              style={{ background: isDark ? sc.darkBg : sc.bg, color: isDark ? sc.darkText : sc.text }}>
              {lead.status}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6', color: isDark ? 'rgba(255,255,255,0.65)' : '#374151' }}>
              {lead.type}
            </span>
          </div>
        </div>

        {/* Status stepper */}
        <div className="mt-6">
          <p className="text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_STEPS.map(s => {
              const isCurrent = lead.status === s;
              const c = STATUS_COLOR[s];
              return (
                <button key={s} onClick={() => handleStatus(s)} disabled={statusLoading}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all border disabled:opacity-50 ${
                    isCurrent
                      ? 'border-transparent'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}
                  style={isCurrent
                    ? { background: isDark ? c.darkBg : c.bg, color: isDark ? c.darkText : c.text }
                    : { background: isDark ? 'transparent' : 'white', color: isDark ? 'rgba(255,255,255,0.45)' : '#6B7280' }
                  }>
                  {isCurrent && <span className="mr-1">✓</span>}
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: info + follow ups */}
        <div className="md:col-span-2 space-y-5">
          {/* Enquiry details */}
          {fields.length > 0 && (
            <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 transition-colors duration-300">
              <h2 className="font-bold text-navy dark:text-white text-sm mb-4">Enquiry Details</h2>
              <div>
                {fields.map(f => (
                  <InfoRow key={f} label={f.replace(/([A-Z])/g, ' $1').trim()} value={lead[f]} />
                ))}
                {lead.notes && <InfoRow label="Notes" value={lead.notes} />}
              </div>
            </div>
          )}

          {/* Follow-up history */}
          <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 transition-colors duration-300">
            <h2 className="font-bold text-navy dark:text-white text-sm mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 dark:text-white/30" /> Follow-up History
              {lead.followUps.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {lead.followUps.length}
                </span>
              )}
            </h2>

            {lead.followUps.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-white/10 mx-auto mb-2" />
                <p className="text-xs text-gray-400 dark:text-white/30">No follow-ups recorded yet.</p>
              </div>
            ) : (
              <div className="relative pl-4 border-l border-gray-100 dark:border-white/5 space-y-4 mb-6">
                {[...lead.followUps].reverse().map((f, i) => (
                  <div key={i} className="relative group">
                    {/* Timeline Dot Indicator */}
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold border-2 border-white dark:border-[#0E1A2B] group-hover:scale-125 transition-transform duration-200" />
                    
                    {/* Note Card */}
                    <div className="bg-gray-50/40 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-2xl p-3.5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                            style={{ background: '#EEF2FF', color: '#3730A3' }}>
                            {(f.addedByName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-navy dark:text-white/80">{f.addedByName || 'Unknown'}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-white/30 font-medium">
                          {new Date(f.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-white/60 leading-relaxed pl-7">{f.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add note */}
            {isStaff && (
              <div className="border-t border-gray-100 dark:border-white/10 pt-4">
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/35 uppercase tracking-wider mb-2">Add Note</p>
                <div className="bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-3 focus-within:border-yellow-400 dark:focus-within:border-yellow-500/50 transition-all duration-200">
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Called client, showed Worli property…"
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm text-navy dark:text-white placeholder-gray-400 dark:placeholder-white/25 resize-none"
                  />
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-2.5 mt-2">
                    <span className="text-[10px] text-gray-400 dark:text-white/30 font-medium">
                      Press Save to record in timeline
                    </span>
                    <button
                      onClick={handleFollowUp}
                      disabled={noteLoading || !note.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-navy transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                    >
                      {noteLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-navy" />
                          <span>Saving…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-navy" />
                          <span>Save Note</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: meta */}
        <div className="space-y-5">
          {/* Assignment */}
          {isLeadCtrl && (
            <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 transition-colors duration-300">
              <h2 className="font-bold text-navy dark:text-white text-sm mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 dark:text-white/30" /> Assignment
              </h2>
              {lead.assignedTo && (
                <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: '#D1FAE5', color: '#065F46' }}>
                    {(lead.assignedTo.name || lead.assignedToName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy dark:text-white">{lead.assignedTo.name || lead.assignedToName}</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/35">Currently assigned</p>
                  </div>
                </div>
              )}
              <CustomSelect
                value={lead.assignedTo?._id || ""}
                onChange={handleAssign}
                placeholder={lead.assignedTo ? "Reassign to…" : "Assign to employee…"}
                options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
              />
            </div>
          )}

          {/* Lead meta */}
          <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 transition-colors duration-300">
            <h2 className="font-bold text-navy dark:text-white text-sm mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-white/30" /> Lead Info
            </h2>
            <div className="space-y-2 text-xs text-gray-500 dark:text-white/40">
              <div className="flex justify-between">
                <span>Source</span>
                <span className="font-semibold text-navy dark:text-white/80 capitalize">{lead.source || 'Website'}</span>
              </div>
              <div className="flex justify-between">
                <span>Received</span>
                <span className="font-semibold text-navy dark:text-white/80">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </span>
              </div>
              {lead.assignedAt && (
                <div className="flex justify-between">
                  <span>Assigned</span>
                  <span className="font-semibold text-navy dark:text-white/80">
                    {new Date(lead.assignedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Follow-ups</span>
                <span className="font-semibold text-navy dark:text-white/80">{lead.followUps.length}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          {lead.phone && (
            <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 transition-colors duration-300">
              <h2 className="font-bold text-navy dark:text-white text-sm mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <a href={`tel:${lead.phone}`}
                  className="flex items-center gap-2.5 w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:scale-[1.01] shadow-sm">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2.5 w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 border border-teal-200 dark:border-teal-500/20 bg-teal-50/50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 hover:scale-[1.01] shadow-sm">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
                {lead.email && (
                  <a href={`mailto:${lead.email}`}
                    className="flex items-center gap-2.5 w-full py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:scale-[1.01] shadow-sm">
                    <Mail className="w-4 h-4" /> Send Email
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
