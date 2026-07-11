import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, FileText, Globe, Landmark, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeUp, staggerContainer } from '../../animations/variants';

export default function NRICorner() {
  const processSteps = [
    {
      num: '01',
      title: 'Consultation & Matching',
      desc: 'Our NRI desk consults on tax and budget parameters, then matches you with curated RERA-registered projects via immersive video walk-throughs.'
    },
    {
      num: '02',
      title: 'Legal Due Diligence',
      desc: 'Our in-house legal advisors verify the title search, builder compliance history, and ensure the contract fits FEMA regulations.'
    },
    {
      num: '03',
      title: 'Power of Attorney (PoA)',
      desc: 'If buying remotely, we assist in drafting and consul attestation of a PoA in your local country so a designated representative can sign in India.'
    },
    {
      num: '04',
      title: 'Secure Capital Remittance',
      desc: 'We coordinate with leading banking partners (HDFC, ICICI, SBI) to ensure easy account wiring through NRE/NRO or FCNR channels.'
    },
    {
      num: '05',
      title: 'Registration & Delivery',
      desc: 'We manage local registry logistics. Once registered, our NRI Property Management Desk can handle tenant search and lease administration.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#071A2F] text-white pt-24 overflow-hidden relative">
      {/* Decorative ambient gold glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bg-gold pointer-events-none" style={{ backgroundColor: '#D4AF37' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bg-gold pointer-events-none" style={{ backgroundColor: '#D4AF37' }} />

      <div className="container-luxury py-16 relative z-10">
        
        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-gold mb-4 inline-block">NRI Investment Desk</span>
          <h1 className="font-display font-black text-4xl md:text-5xl leading-tight tracking-tight mb-6">
            Secure Remote Property <span className="text-gold" style={{ color: '#D4AF37' }}>Acquisition for NRIs</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Acquire, verify, lease, and manage premium properties in Pune entirely from your country of residence. Fully compliant with FEMA rules & RBI regulations.
          </p>
        </motion.div>

        {/* FEMA & Compliance Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {/* FEMA Rules Card */}
          <motion.div 
            variants={fadeUp}
            className="rounded-3xl p-8 border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gold/10 text-gold mb-6">
                <ShieldCheck className="w-6 h-6" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">FEMA Compliance</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                NRIs and OCIs can purchase residential or commercial properties freely in India. No prior RBI permissions are required.
              </p>
            </div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold" style={{ color: '#D4AF37' }}>100% RBI Allowed</span>
          </motion.div>

          {/* Accounts & Remittances */}
          <motion.div 
            variants={fadeUp}
            className="rounded-3xl p-8 border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gold/10 text-gold mb-6">
                <Landmark className="w-6 h-6" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Accounts & Remittance</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                Inward remittances can flow directly from NRE, NRO, or FCNR accounts. Transactions in foreign currency notes are not permitted.
              </p>
            </div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold" style={{ color: '#D4AF37' }}>Flexible Capital Channels</span>
          </motion.div>

          {/* Excluded Lands Warning */}
          <motion.div 
            variants={fadeUp}
            className="rounded-3xl p-8 border border-red-500/10 bg-red-500/[0.01] backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-400 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Restricted Assets</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                NRIs cannot acquire agricultural land, farmhouses, or plantation properties in India unless received via special inheritance or prior RBI permissions.
              </p>
            </div>
            <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">FEMA Restriction</span>
          </motion.div>
        </motion.div>

        {/* Remote Purchase Timeline */}
        <div className="mb-20">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-12">
            The Remote Purchase Process
          </h2>
          <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-12">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Node indicator */}
                <div 
                  className="absolute -left-[18px] top-0 w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-navy border-4 border-[#071A2F]" 
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                >
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-xs max-w-2xl leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div 
          className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-white/5"
          style={{
            background: 'linear-gradient(135deg, rgba(14,26,43,0.85) 0%, rgba(7,26,47,0.95) 100%)'
          }}
        >
          <div className="max-w-xl mx-auto relative z-10">
            <h3 className="font-display font-bold text-xl md:text-2xl mb-4">Ready to Explore Pune Real Estate?</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-6">
              Connect with our NRI investment experts. Schedule a timezone-aware virtual visit, review FEMA tax compliance, or request PoA blueprints.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                state={{ subject: 'NRI Desk Consultation' }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-navy text-xs font-bold px-6 py-3.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #E8C84A)',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)'
                }}
              >
                Schedule Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/properties" 
                className="inline-flex items-center justify-center gap-2 border border-white/10 text-white hover:bg-white/5 text-xs font-bold px-6 py-3.5 rounded-full transition-all"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
