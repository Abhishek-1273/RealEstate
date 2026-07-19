import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Loader, MessageSquare } from 'lucide-react';
import { sendChatMessage } from '../../utils/api';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your HyperRelestix Luxury Property Advisor. How can I assist you with Pune premium real estate, NRI investments, or FEMA compliance today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Focus the input when the drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const reply = await sendChatMessage(conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I am facing connectivity issues at the moment. Please try again shortly.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Chat Float Button ── */}
      <div className="fixed bottom-7 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={isOpen ? 'Close AI property advisor chat' : 'Open AI property advisor chat'}
          aria-expanded={isOpen}
          aria-controls="ai-chat-drawer"
          className="w-14 h-14 rounded-full flex items-center justify-center text-navy shadow-lg transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #E8C84A)',
            boxShadow: isOpen ? '0 0 0 0 rgba(212,175,55,0)' : '0 8px 28px rgba(212,175,55,0.4)'
          }}
        >
          {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <MessageSquare className="w-6 h-6" aria-hidden="true" />}
        </motion.button>
      </div>

      {/* ── Chat Drawer Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-drawer"
            role="dialog"
            aria-label="HyperRelestix AI Property Advisor"
            aria-modal="false"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[380px] h-[500px] flex flex-col rounded-3xl border shadow-luxury overflow-hidden backdrop-blur-xl transition-all duration-300"
            style={{
              background: 'rgba(7, 26, 47, 0.92)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.06), transparent)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
                  <Sparkles className="w-4.5 h-4.5 text-navy" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-xs leading-none">HyperRelestix AI</h2>
                  <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5 tracking-wider uppercase">Luxury Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              data-lenis-prevent
              role="log"
              aria-label="Chat conversation"
              aria-live="polite"
              aria-relevant="additions"
              className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-4 scrollbar-thin"
            >
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-gold/20" style={{ background: 'rgba(212,175,55,0.05)' }} aria-hidden="true">
                      <Bot className="w-4 h-4 text-gold" style={{ color: '#D4AF37' }} />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${m.role === 'user'
                        ? 'bg-gold text-navy font-semibold rounded-tr-none'
                        : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'
                      }`}
                    style={{
                      background: m.role === 'user' ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : undefined
                    }}
                  >
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/10 bg-white/5" aria-hidden="true">
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5 justify-start" aria-label="Advisor is thinking">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-gold/20" style={{ background: 'rgba(212,175,55,0.05)' }} aria-hidden="true">
                    <Bot className="w-4 h-4 text-gold" style={{ color: '#D4AF37' }} />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <Loader className="w-3.5 h-3.5 animate-spin text-gold" style={{ color: '#D4AF37' }} aria-hidden="true" />
                    <span className="text-[10px] text-white/50 tracking-wider">Advisor is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-navy/50 flex gap-2">
              <label htmlFor="ai-chat-input" className="sr-only">Message HyperRelestix AI advisor</label>
              <input
                id="ai-chat-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, FEMA or Pune..."
                className="flex-1 bg-white/5 text-white placeholder-white/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold/50 transition-colors"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-navy transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
