import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.widget) {
        return (
          <div className="w-full h-full min-h-[250px] flex flex-col items-center justify-center p-6 bg-red-500/5 border border-red-500/10 rounded-2xl text-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h4 className="text-sm font-bold text-navy dark:text-white">Section Load Failed</h4>
            <p className="text-xs text-ink-soft dark:text-white/50 max-w-xs leading-relaxed">
              We encountered an unexpected error loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Retry
            </button>
          </div>
        );
      }
      return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#071A2F]">
          {/* Ambient decorative radial gold glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px] opacity-10 bg-gold" style={{ backgroundColor: '#D4AF37' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px] opacity-10 bg-gold" style={{ backgroundColor: '#D4AF37' }} />

          <div 
            className="w-full max-w-lg p-8 md:p-10 rounded-3xl border text-center relative z-10 backdrop-blur-xl transition-all duration-300"
            style={{
              background: 'rgba(14, 26, 43, 0.45)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="font-display font-black text-white text-2xl md:text-3xl leading-tight mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Something Went Wrong
            </h1>
            
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              We encountered an unexpected error while loading this section. Our advisors have been notified. Please try reloading the page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-full text-navy text-xs font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #E8C84A)',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)'
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </button>
              
              <a
                href="/"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-full border text-white hover:bg-white/5 text-xs font-semibold transition-all duration-300 border-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="w-3.5 h-3.5 text-gold" style={{ color: '#D4AF37' }} /> Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
