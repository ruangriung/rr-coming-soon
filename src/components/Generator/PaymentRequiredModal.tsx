import React from 'react';
import { Key, Github, AlertTriangle, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentRequiredModal({ isOpen, onClose }: PaymentRequiredModalProps) {
  const handleConnect = () => {
    const params = new URLSearchParams({
      redirect_uri: window.location.origin + window.location.pathname,
      client_id: 'pk_hprMp1nmhXOvJE7H', 
      scope: 'usage keys',
      expiry: '30',
      budget: '10'
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 blur-[100px] pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-8 border border-orange-500/30">
                <AlertTriangle size={40} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                Saldo <span className="text-orange-500">Habis</span> / PRO Required
              </h3>
              
              <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-sm">
                Maaf, limit akses gratis telah mencapai batasnya atau saldo Pollen Anda tidak mencukupi untuk request ini.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={handleConnect}
                  className="w-full h-16 bg-white text-black hover:bg-orange-500 hover:text-white rounded-2xl font-black uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all group"
                >
                  <Github size={20} />
                  Login via GitHub
                  <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="pt-6 border-t border-white/5 w-full">
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-4">Kenapa saya melihat ini?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                      <p className="text-white/60 text-[9px] font-bold leading-tight">Gunakan Pollinations Pro untuk akses model premium tanpa hambatan.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                      <p className="text-white/60 text-[9px] font-bold leading-tight">Saldo gratis diatur oleh penyedia API Pollinations.ai.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
