import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function GeneratorNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('rr_cache_notice_dismissed') === 'true';
    if (!isDismissed) {
      setShowNotice(true);
    }
  }, []);

  if (!showNotice) return null;

  const dismissNotice = () => {
    localStorage.setItem('rr_cache_notice_dismissed', 'true');
    setShowNotice(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-4 shadow-sm relative pr-12">
        <div className="p-2 bg-orange-500/20 text-orange-500 rounded-xl shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1 mt-0.5">
          <h4 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Pembaruan Sistem AI</h4>
          <p className="text-[11px] font-medium text-slate-600 dark:text-white/60 leading-relaxed">
            Untuk memastikan performa generator yang optimal, apabila Anda mengalami kendala saat memproses gambar atau video, kami menyarankan Anda untuk membersihkan cache/cookies pada browser dan melakukan login kembali.
          </p>
        </div>
        <button 
          onClick={dismissNotice}
          className="absolute top-4 right-4 p-1 text-orange-500/50 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all cursor-pointer"
          title="Tutup informasi ini"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
