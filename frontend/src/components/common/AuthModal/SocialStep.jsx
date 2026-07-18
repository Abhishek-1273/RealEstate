import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa6';

export default function SocialStep({ socialProvider, loading, onBack, onSocialVerify }) {
  return (
    <motion.div
      key="social-select-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 text-center"
    >
      <div className="flex items-center gap-2 mb-2 text-left">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-display font-bold text-lg text-white">
          Sign in with {socialProvider}
        </h2>
      </div>

      {socialProvider === 'Google' && (
        <div className="bg-white rounded-2xl p-5 text-gray-800 space-y-4 shadow-xl border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FaGoogle className="w-6 h-6 text-[#DB4437]" />
            <span className="font-black text-sm tracking-tight text-gray-800 font-display">Google</span>
          </div>
          
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Choose an account to continue to <span className="font-semibold text-gray-700">HyperRelestix</span>
          </p>

          <div className="space-y-2 text-left">
            <button
              type="button"
              onClick={() => onSocialVerify('Abhishek Kayg', 'akayg@gmail.com')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold font-bold flex items-center justify-center text-xs" style={{ color: '#D4AF37' }}>
                AK
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Abhishek Kayg</p>
                <p className="text-[10px] text-gray-400">akayg@gmail.com</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => onSocialVerify('Demo User', 'demo@gmail.com')}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs">
                DU
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Demo User</p>
                <p className="text-[10px] text-gray-400">demo@gmail.com</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {socialProvider === 'Facebook' && (
        <div className="bg-[#1877F2] rounded-2xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-center gap-2">
            <FaFacebookF className="w-6 h-6 text-white" />
            <span className="font-black text-base font-display">facebook</span>
          </div>
          
          <p className="text-xs text-white/80 font-medium">
            HyperRelestix is requesting access to your name and email profile.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onSocialVerify('Abhishek Kayg', 'akayg@facebook.com')}
              disabled={loading}
              className="w-full bg-white text-[#1877F2] hover:bg-gray-50 transition-colors font-bold text-xs py-3 rounded-xl shadow-md"
            >
              {loading ? 'Connecting...' : 'Continue as Abhishek Kayg'}
            </button>
          </div>
        </div>
      )}

      {socialProvider === 'Apple' && (
        <div className="bg-black border border-white/10 rounded-2xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-center gap-2">
            <FaApple className="w-6 h-6 text-white" />
            <span className="font-bold text-sm tracking-tight text-white font-display">Apple ID</span>
          </div>
          
          <p className="text-[11px] text-white/50 leading-relaxed max-w-xs mx-auto">
            Use your Apple ID to sign in to <span className="text-white font-semibold">HyperRelestix</span>.
          </p>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-left">
            <p className="text-[9px] text-white/45 uppercase tracking-wider font-bold">Apple ID</p>
            <p className="text-xs text-white/90 font-medium mt-0.5">akayg@icloud.com</p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSocialVerify('Abhishek Kayg', 'akayg@icloud.com')}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100 transition-colors font-black text-xs py-3 rounded-xl shadow-md"
            >
              {loading ? 'Verifying with Touch ID...' : 'Continue with Touch ID / Password'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-xs text-white/50 pt-2">
          <Loader2 className="w-4 h-4 animate-spin text-gold" style={{ color: '#D4AF37' }} />
          <span>Completing secure login...</span>
        </div>
      )}
    </motion.div>
  );
}
