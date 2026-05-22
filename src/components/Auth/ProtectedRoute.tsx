import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2 border-r-orange-500/20" />
          <div className="absolute text-[8px] font-black text-orange-500 uppercase tracking-widest">RR</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 blur-[120px] pointer-events-none" />

        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden z-10 text-center"
        >
          {/* Internal Glow */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-orange-500/20 blur-3xl pointer-events-none" />

          {/* Logo / Icon */}
          <div className="h-20 w-20 rounded-full bg-orange-500/15 flex items-center justify-center text-orange-500 mx-auto mb-8 border border-orange-500/25 shadow-lg shadow-orange-500/5">
            <Sparkles size={32} />
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mb-3">
            Akses <span className="text-orange-500">AI Studio</span>
          </h3>
          
          <p className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest mb-8">
            Masuk untuk Mulai Berkarya
          </p>

          <p className="text-white/50 text-xs md:text-sm font-medium leading-relaxed mb-8 max-w-sm mx-auto">
            Gunakan akun Google Anda untuk mengakses studio pembuatan gambar, video, dan audio bertenaga AI secara tak terbatas.
          </p>

          <div className="space-y-4">
            <button
              onClick={login}
              className="w-full h-14 bg-white text-black hover:bg-slate-100 rounded-xl font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer text-xs shadow-lg hover:shadow-white/5"
            >
              <img src="/google-icon.svg" alt="Google Icon" className="h-5 w-5" />
              Masuk dengan Google
            </button>

            <a
              href="/"
              className="inline-block text-[10px] text-white/30 hover:text-white/60 font-bold uppercase tracking-widest transition-colors py-2"
            >
              Kembali ke Beranda
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
