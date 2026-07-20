import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { useSiteSettings } from '../../contexts';

export default function PrivacyPolicy() {
  const { settings } = useSiteSettings();
  const brandName = settings ? `${settings.logoTextPrimary || 'Hyper'}${settings.logoTextSecondary || 'Relestix'}` : 'HyperRelestix';
  const privacyEmail = settings?.contactEmail1 || 'hello@hyperrelestix.in';
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
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-navy dark:text-white text-4xl mb-4 leading-tight">
            Privacy Policy
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
                <Eye className="w-5 h-5 text-gold" /> 1. Information We Collect
              </h2>
              <p>
                At {brandName}, we collect personal information you provide directly to us when exploring listings, submitting enquirires, scheduling site visits, or contacting our luxury property advisors. This information includes your name, email address, phone number, and properties of interest.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-gold" /> 2. How We Use Your Information
              </h2>
              <p>
                Your personal details are used solely to facilitate your search, connect you with qualified agents, arrange physical or virtual site visits, and coordinate customized notifications for properties matching your luxury search preferences. We do not sell or lease your personal information to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-gold" /> 3. Data Protection and Security
              </h2>
              <p>
                We employ industry-standard security protocols to maintain the safety of your personal information. Database storage is protected using encryption methods and secured access layers to safeguard your records against unauthorized modification or disclosure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-display font-bold text-navy dark:text-white flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-gold" /> 4. Cookies & Web Tracking
              </h2>
              <p>
                Our platform uses local cookies to store visitor preferences, manage session states, and customize map displays. You can manage or disable cookie configurations from your browser settings, though some interactive elements (like custom map viewports and wishlist caching) might require cookies to function correctly.
              </p>
            </section>

            <section className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
              <h2 className="text-base font-bold text-navy dark:text-white">
                Contact Our Compliance Officer
              </h2>
              <p className="text-xs">
                If you have questions regarding this Privacy Policy or data security actions, you may email us directly at <a href={`mailto:${privacyEmail}`} className="text-gold font-bold hover:underline">{privacyEmail}</a>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
