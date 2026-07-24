import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { useSiteSettings, getBrandName } from '../../contexts';

export default function TermsOfService() {
  const { settings } = useSiteSettings();
  const brandName = getBrandName(settings);
  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-32 pb-20 transition-colors duration-300">
      <div className="container-luxury max-w-4xl">
        
        {/* Header */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          className="text-center mb-16"
        >
          <div className="inline-flex p-3.5 rounded-2xl bg-gold/10 text-gold mb-5">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-navy dark:text-white text-4xl mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-ink-soft dark:text-white/40 text-xs font-accent tracking-widest uppercase font-bold">
            Last Updated: July 10, 2026
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-navy rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300"
        >
          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-ink-muted dark:text-white/70 text-sm leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-gold" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or utilizing the {brandName} luxury real estate platform, you agree to comply with and be bound by these Terms of Service. If you disagree with any segment of these provisions, you must terminate usage of the platform immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-gold" /> 2. Accuracy of Listing Data
              </h2>
              <p>
                {brandName} aims to supply verified, RERA-registered luxury property details (pricing plans, layout plans, and availability status). However, all content is uploaded for reference convenience. Interested parties must verify details, RERA compliance certificates, and contract specifications before closing any real estate deals.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-gold" /> 3. User Conduct & Bookings
              </h2>
              <p>
                When submitting enquirires, scheduling site visits, or booking advisory services, you agree to provide truthful, accurate, and complete contact parameters. Spamming, fake booking scheduling, or scraping listing records using automated tools is strictly prohibited and can result in account suspension.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-gold" /> 4. Intellectual Property
              </h2>
              <p>
                All graphic assets, brand elements, custom interactive modules (including the 3D floor plans and map search logic), and listing descriptions are protected by intellectual property laws. Reproduction, redistribution, or modification of these assets without written approval is strictly forbidden.
              </p>
            </section>

            <section className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
              <h2 className="text-base font-bold text-navy dark:text-white">
                Legal Jurisdictions
              </h2>
              <p className="text-xs">
                These terms are governed by the laws of India. Any litigation disputes relating to using this platform will fall under the exclusive jurisdiction of the courts located in Pune, Maharashtra.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
