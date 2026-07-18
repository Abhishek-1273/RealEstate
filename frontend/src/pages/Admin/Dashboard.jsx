import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TrendingUp, Inbox, Building2, Users, ArrowRight, Loader2, Calendar, FileText, Globe, Pencil } from 'lucide-react';
import { getProperties, getUsers, getPartnersAdmin, getEnquiries } from '../../utils/adminApi';
import { fetchBlogs } from '../../utils/api';
import { useAdmin } from './AdminContext';
import { SkeletonDashboard } from '../../components/common/Skeleton';

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white dark:bg-[#0E1A2B] rounded-2xl p-5 border border-gray-150 dark:border-white/10 shadow-sm hover:shadow-md hover:border-gold/30 dark:hover:border-gold/20 transition-all duration-300 group relative overflow-hidden">
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: color }} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        
        {/* Trend badge */}
        {trend && (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all duration-300"
            style={{
              backgroundColor: `${color}08`,
              color: color,
              borderColor: `${color}15`
            }}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-black text-navy dark:text-white mb-0.5 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {value ?? '—'}
        </p>
        <p className="text-[10px] font-extrabold text-gray-400 dark:text-white/30 uppercase tracking-wider">{label}</p>
        {sub && (
          <p className="text-[10px] text-gray-450 dark:text-white/25 mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isMgmt } = useAdmin();
  const isAgent = user?.role === 'agent';
  const [counts, setCounts] = useState({ properties: 0, blogs: 0, partners: 0, users: 0, myLeads: 0 });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect dark mode for styles
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    (async () => {
      try {
        const pData = await getProperties({ limit: 3 });
        setRecentProperties(pData.properties || []);

        let bData = { blogs: [] };
        let partnersData = { partners: [] };
        let userData = { users: [] };
        let myLeadsData = { enquiries: [] };

        if (!isAgent) {
          const [bRes, pRes, uRes] = await Promise.all([
            fetchBlogs({ limit: 3 }).catch(() => ({ blogs: [] })),
            getPartnersAdmin().catch(() => ({ partners: [] })),
            isMgmt ? getUsers().catch(() => ({ users: [] })) : Promise.resolve({ users: [] })
          ]);
          bData = bRes || { blogs: [] };
          partnersData = pRes || { partners: [] };
          userData = uRes || { users: [] };
          setRecentBlogs(bData.blogs || []);
        } else {
          myLeadsData = await getEnquiries({ limit: 100 }).catch(() => ({ enquiries: [] }));
        }        setCounts({
          properties: pData.total || pData.properties?.length || 0,
          blogs: bData.blogs ? bData.blogs.length : (Array.isArray(bData) ? bData.length : 0),
          partners: partnersData.partners ? partnersData.partners.length : 0,
          users: userData.users ? userData.users.filter(x => x.role !== 'client').length : 0,
          myLeads: myLeadsData.enquiries ? myLeadsData.enquiries.length : 0
        });
        
        // Handle array or object wrapper response for blogs
        const blogsArray = bData.blogs || (Array.isArray(bData) ? bData : []);
        setRecentBlogs(blogsArray);
      } catch (e) {
        console.error("Dashboard metrics fetch failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isMgmt, isAgent]);

  if (loading) return <SkeletonDashboard />;

  return (
    <div className="animate-fade-in pb-8">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-7 border border-transparent dark:border-white/5 shadow-lg bg-[#071A2F]"
        style={{
          background: 'linear-gradient(135deg, #071A2F 0%, #0c2543 50%, #051324 100%)'
        }}>
        {/* Glowing visual ambient blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold text-[9px] font-black uppercase tracking-widest border border-gold/15">
                Internal Portal
              </span>
              <span className="text-white/30 text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Welcome back, <span style={{ color: '#D4AF37' }}>{user?.name || 'Administrator'}</span>
            </h1>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
              Here is the live activity overview for the HyperRelestix luxury portfolio. Optimize listings, manage active customer leads, and oversee operations.
            </p>
          </div>

          {isAgent ? (
            <div className="flex items-center gap-4 shrink-0 bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
              <div className="text-center border-r border-white/10 pr-4">
                <p className="text-gold text-lg font-black">{counts.properties}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-400 text-lg font-black">{counts.myLeads}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">My Leads</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 shrink-0 bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
              <div className="text-center border-r border-white/10 pr-4">
                <p className="text-gold text-lg font-black">{counts.properties}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Listings</p>
              </div>
              <div className="text-center border-r border-white/10 pr-4">
                <p className="text-purple-400 text-lg font-black">{counts.blogs}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Blogs</p>
              </div>
              <div className="text-center pr-4 border-r border-white/10">
                <p className="text-emerald-400 text-lg font-black">{counts.partners}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Partners</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-400 text-lg font-black">{counts.users}</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Staff</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAgent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          <StatCard 
            icon={Building2}  
            label="Luxury Listings"      
            value={counts.properties}  
            sub="Live on public site"  
            color="#D4AF37" 
            trend="Active"
          />
          <StatCard 
            icon={Inbox} 
            label="My Assigned Leads"       
            value={counts.myLeads} 
            sub="Assigned enquiries"   
            color="#7C3AED" 
            trend="Active"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard 
            icon={Building2}  
            label="Luxury Listings"      
            value={counts.properties}  
            sub="Live on public site"  
            color="#D4AF37" 
            trend="+12% growth"
          />
          <StatCard 
            icon={FileText} 
            label="Editorial Blogs"       
            value={counts.blogs} 
            sub="Published articles"   
            color="#7C3AED" 
            trend="Weekly"
          />
          <StatCard 
            icon={Globe}     
            label="Developer Partners"      
            value={counts.partners}      
            sub="Featured builders" 
            color="#059669" 
            trend="Verified"
          />
          {isMgmt && (
            <StatCard 
              icon={Users} 
              label="Staff Directory" 
              value={counts.users}  
              sub="Active team accounts" 
              color="#0891B2" 
              trend="Active"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Properties */}
        <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-150 dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.01]">
              <div>
                <h3 className="font-bold text-navy dark:text-white text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Luxury Listings</h3>
                <p className="text-[10px] text-gray-400 dark:text-white/35">Latest premium properties added to database</p>
              </div>
              <RouterLink to="/admin/properties" className="text-xs font-bold text-gold hover:text-gold-light flex items-center gap-1 group transition-colors shrink-0">
                <span>Manage listings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </RouterLink>
            </div>

            <div className="p-4 space-y-3.5">
              {recentProperties.length === 0 ? (
                <p className="text-center py-10 text-xs text-gray-400 dark:text-white/20">No properties available.</p>
              ) : (
                recentProperties.map(p => (
                  <div key={p._id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-gray-400 dark:text-white/30" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-navy dark:text-white truncate group-hover:text-gold transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-white/30 truncate mt-0.5">{p.location}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-black text-navy dark:text-white px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 uppercase">
                          {p.priceLabel || `₹${(p.price/10000000).toFixed(1)} Cr`}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.status === 'Ready to Move' ? 'bg-green-500/10 text-green-500' :
                          p.status === 'Under Construction' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01] text-center">
            <RouterLink to="/admin/properties" className="text-xs font-semibold text-gray-500 dark:text-white/40 hover:text-navy dark:hover:text-white transition-colors">
              Configure inventory and upload details
            </RouterLink>
          </div>
        </div>

        {/* Right Column: Recent Blogs (Only shown for non-agents) */}
        {!isAgent && (
          <div className="bg-white dark:bg-[#0E1A2B] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/[0.01]">
                <div>
                  <h3 className="font-bold text-navy dark:text-white text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Editorial Blogs</h3>
                  <p className="text-[10px] text-gray-400 dark:text-white/35">Latest published guides and market studies</p>
                </div>
                <RouterLink to="/admin/blogs" className="text-xs font-bold text-gold hover:text-gold-light flex items-center gap-1 group transition-colors shrink-0">
                  <span>Manage blogs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </RouterLink>
              </div>

              <div className="p-4 space-y-3.5">
                {recentBlogs.length === 0 ? (
                  <p className="text-center py-10 text-xs text-gray-400 dark:text-white/20">No articles available.</p>
                ) : (
                  recentBlogs.map(b => (
                    <div key={b._id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                      {b.image ? (
                        <img src={b.image} alt={b.title} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-white/10 animate-fade-in" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-gray-400 dark:text-white/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-semibold text-navy dark:text-white truncate group-hover:text-gold transition-colors">
                          {b.title}
                        </p>
                        <p className="text-[10px] text-gray-450 dark:text-white/35 mt-0.5 truncate">{b.subtitle || 'HyperRelestix Editorial'}</p>
                        <div className="flex items-center gap-2.5 mt-2">
                          <span className="text-[9px] text-gray-400 dark:text-white/20 font-bold whitespace-nowrap">
                            {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {b.readTime && (
                            <span className="text-[9px] text-gold font-extrabold uppercase whitespace-nowrap">
                              {b.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-white/[0.01] text-center">
              <RouterLink to="/admin/blogs" className="text-xs font-semibold text-gray-500 dark:text-white/40 hover:text-navy dark:hover:text-white transition-colors">
                Write editorial posts and publish articles
              </RouterLink>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
