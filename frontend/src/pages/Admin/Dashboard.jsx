import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Inbox, Building2, Users, ArrowRight, Loader2 } from 'lucide-react';
import { getStats, getEnquiries, getProperties, getUsers } from '../../utils/adminApi';
import { useAdmin } from './AdminContext';

const STATUS_COLOR = {
  new:       { bg: '#DBEAFE', text: '#1E40AF', darkBg: 'rgba(30,64,175,0.18)', darkText: '#93B4F7' },
  contacted: { bg: '#FEF9C3', text: '#854D0E', darkBg: 'rgba(133,77,14,0.18)',  darkText: '#FBD07A' },
  visited:   { bg: '#EDE9FE', text: '#5B21B6', darkBg: 'rgba(91,33,182,0.18)',  darkText: '#C4B5FD' },
  qualified: { bg: '#D1FAE5', text: '#065F46', darkBg: 'rgba(6,95,70,0.18)',    darkText: '#6EE7B7' },
  converted: { bg: '#DCFCE7', text: '#14532D', darkBg: 'rgba(20,83,45,0.18)',   darkText: '#86EFAC' },
  lost:      { bg: '#FEE2E2', text: '#7F1D1D', darkBg: 'rgba(127,29,29,0.18)', darkText: '#FCA5A5' },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-black text-navy dark:text-white mb-0.5" style={{ fontFamily: 'Manrope,sans-serif' }}>{value ?? '—'}</p>
      <p className="text-xs font-semibold text-gray-500 dark:text-white/45">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { isMgmt } = useAdmin();
  const [stats,  setStats]  = useState(null);
  const [leads,  setLeads]  = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Detect dark mode for status color
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    (async () => {
      try {
        const [s, l, p, u] = await Promise.all([
          getStats(),
          getEnquiries({ limit: 8 }),
          getProperties({ limit: 1 }),
          isMgmt ? getUsers() : Promise.resolve({ count: null }),
        ]);
        setStats(s.stats);
        setLeads(l.enquiries);
        setCounts({ properties: p.total, users: u.count });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [isMgmt]);

  const byStatus = stats ? Object.fromEntries(stats.byStatus.map(s => [s._id, s.count])) : {};

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-gold" style={{ color: '#D4AF37' }} />
    </div>
  );

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-navy dark:text-white mb-1" style={{ fontFamily: 'Manrope,sans-serif' }}>Dashboard</h1>
        <p className="text-gray-500 dark:text-white/40 text-sm">Overview of all activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon={Inbox}     label="Total Leads"      value={stats?.total}      sub={`+${stats?.recentWeek ?? 0} this week`} color="#D4AF37" />
        <StatCard icon={TrendingUp} label="Converted"       value={byStatus.converted ?? 0} sub="Closed deals"   color="#059669" />
        <StatCard icon={Building2}  label="Properties"      value={counts.properties}  sub="Live listings"  color="#7C3AED" />
        {isMgmt && <StatCard icon={Users} label="Staff Members" value={counts.users}  sub="Active accounts" color="#0891B2" />}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
        {['new','contacted','visited','qualified','converted','lost'].map(s => {
          const c = STATUS_COLOR[s];
          return (
            <div key={s} className="bg-white dark:bg-[#0E1A2B] rounded-xl p-4 border border-gray-100 dark:border-white/10 text-center transition-colors duration-300">
              <p className="text-xl font-black mb-1" style={{ fontFamily: 'Manrope,sans-serif', color: isDark ? c.darkText : c.text }}>
                {byStatus[s] ?? 0}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                style={{ background: isDark ? c.darkBg : c.bg, color: isDark ? c.darkText : c.text }}>
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent leads */}
      <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <h2 className="font-bold text-navy dark:text-white text-sm">Recent Leads</h2>
          <Link to="/admin/leads" className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: '#D4AF37' }}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-white/5">
          {leads.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400 dark:text-white/30 text-sm">No leads yet</p>
          ) : leads.map(l => {
            const sc = STATUS_COLOR[l.status] || STATUS_COLOR.new;
            return (
              <Link key={l._id} to={`/admin/leads/${l._id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                  style={{ background: '#EEF2FF', color: '#3730A3' }}>
                  {l.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy dark:text-white truncate">{l.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/35 truncate">{l.phone} · {l.type}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize"
                  style={{ background: isDark ? sc.darkBg : sc.bg, color: isDark ? sc.darkText : sc.text }}>
                  {l.status}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-white/30 hidden sm:block shrink-0">
                  {new Date(l.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
