import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SuccessStep({ isNew, userName, pendingRedirect, onDone }) {
  return (
    <motion.div
      key="success-step"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-4 space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, delay: 0.1 }}
        className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </motion.div>

      <div className="space-y-1.5">
        <h3 className="font-display font-bold text-xl text-white">
          {isNew ? `Welcome, ${userName.split(' ')[0]}! 🎉` : `Welcome back!`}
        </h3>
        <p className="text-white/60 text-xs max-w-xs mx-auto leading-relaxed">
          {isNew
            ? 'Your account has been created. You now have full access to all premium services.'
            : 'Signed in successfully. You now have full access to all premium services.'
          }
        </p>
      </div>

      <button onClick={onDone} className="btn-primary mx-auto py-2.5 px-6 text-xs">
        {pendingRedirect ? 'Continue to Service' : 'Explore Properties'}{' '}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
