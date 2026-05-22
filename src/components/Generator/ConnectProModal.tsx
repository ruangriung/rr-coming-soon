import React from 'react';
import { Key, Github, AlertCircle, X, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modelName?: string;
}

export default function ConnectProModal({ isOpen, onClose, onConfirm, modelName }: ConnectProModalProps) {
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
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-8 border border-orange-500/30 shadow-lg shadow-orange-500/10">
                <Key size={40} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                Hubungkan <span className="text-orange-500">Akun PRO</span>
              </h3>
              
              <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-6">
                Model {modelName ? <span className="text-orange-500 font-black">"{modelName.toUpperCase()}"</span> : "Premium"} Memerlukan API Key
              </p>

              <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed mb-8 max-w-sm">
                Untuk menggunakan model PRO tier premium, hilangkan batasan generasi, dan dapatkan prioritas rendering, hubungkan kunci akses Anda dengan otentikasi akun Pollinations.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={onConfirm}
                  className="w-full h-16 bg-orange-500 text-white hover:bg-orange-600 rounded-2xl font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all group shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98] cursor-pointer text-xs md:text-sm"
                >
                  <Sparkles size={18} className="animate-pulse" />
                  Hubungkan Sekarang
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full h-12 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl font-bold uppercase tracking-widest transition-all cursor-pointer text-[10px]"
                >
                  Gunakan Model Standar (Gratis)
                </button>

                <div className="pt-6 border-t border-white/5 w-full text-left">
                  <div className="flex items-start gap-2 text-[9px] text-white/30 font-bold uppercase tracking-wide">
                    <AlertCircle size={12} className="text-orange-500/60 shrink-0 mt-0.5" />
                    <span>Autentikasi menggunakan GitHub OAuth yang aman langsung ke server resmi Pollinations.ai.</span>
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
