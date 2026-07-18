import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function OTPStep({
  otpTarget,
  timer,
  loading,
  serverError,
  otpSuccessMessage,
  otpCode,
  onBack,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onResendOtp,
  onVerifyOtp
}) {
  return (
    <motion.div
      key="otp-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-left">
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Enter Verification Code
          </h2>
          <p className="text-white/50 text-[10px] mt-0.5">
            Sent to: <span className="text-gold font-bold" style={{ color: '#D4AF37' }}>{otpTarget}</span>
          </p>
        </div>
      </div>

      {/* Server error / success banner */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2 text-red-400 text-xs">
          {serverError}
        </div>
      )}
      
      {otpSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2 text-emerald-400 text-xs text-center">
          {otpSuccessMessage}
        </div>
      )}

      {/* 6 OTP Boxes */}
      <div className="flex justify-between gap-2 max-w-xs mx-auto py-2">
        {otpCode.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => onOtpChange(e.target.value, idx)}
            onKeyDown={e => onOtpKeyDown(e, idx)}
            onPaste={idx === 0 ? onOtpPaste : undefined}
            className="w-10 h-11 text-center text-base font-extrabold bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl text-white focus:outline-none focus:bg-white/8 transition-all"
          />
        ))}
      </div>

      {/* Countdown Timer */}
      <div className="text-center text-xs text-white/40">
        {timer > 0 ? (
          <p>Resend code in <span className="text-gold font-bold" style={{ color: '#D4AF37' }}>{timer}s</span></p>
        ) : (
          <button
            type="button"
            onClick={onResendOtp}
            disabled={loading}
            className="text-gold hover:underline font-bold transition-all disabled:opacity-50"
            style={{ color: '#D4AF37' }}
          >
            Resend OTP code
          </button>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={onVerifyOtp}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed justify-center py-2.5 text-xs font-bold"
        >
          {loading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...</>
          ) : (
            <>Verify & Login <CheckCircle2 className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}
