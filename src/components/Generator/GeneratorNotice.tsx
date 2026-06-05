import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function GeneratorNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const isDismissed = localStorage.getItem('rr_cache_notice_dismissed') === 'true';
    if (!isDismissed) {
      const timer = setTimeout(() => setShowNotice(true), 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!showNotice || !user) return null;

  const dismissNotice = () => {
    localStorage.setItem('rr_cache_notice_dismissed', 'true');
    setShowNotice(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/10 text-center flex flex-col items-center">
        
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 border border-orange-500/20 shadow-inner">
          <AlertCircle size={32} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">
          Pembaruan Sistem AI
        </h3>
        
        <p className="text-sm font-bold text-slate-500 dark:text-white/60 leading-relaxed mb-8">
          Untuk memastikan performa generator yang optimal, apabila Anda mengalami kendala saat memproses gambar atau video, kami menyarankan Anda untuk membersihkan cache/cookies pada browser dan melakukan login kembali.
        </p>

        <button 
          onClick={dismissNotice}
          className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 cursor-pointer"
        >
          Mengerti
        </button>

        <button 
          onClick={dismissNotice}
          className="absolute top-4 right-4 p-3 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-full transition-all cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
