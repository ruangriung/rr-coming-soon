import React, { useEffect, useState } from 'react';
import { Key, Unplug, ShieldCheck, Info, Github } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BYOPHandler({ onKeyChange }: { onKeyChange?: () => void }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check for api_key in hash fragment (redirect from Pollinations)
    const hash = window.location.hash;
    if (hash.includes('api_key=')) {
      const params = new URLSearchParams(hash.slice(1));
      const key = params.get('api_key');
      if (key) {
        localStorage.setItem('pollinations_api_key', key);
        window.dispatchEvent(new Event('storage'));
        setApiKey(key);
        if (onKeyChange) onKeyChange();
        // Clean hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        toast.success('Terhubung ke Pollinations Pro!');
      }
    } else {
      const storedKey = localStorage.getItem('pollinations_api_key');
      if (storedKey) setApiKey(storedKey);
    }
  }, [onKeyChange]);

  const handleConnect = () => {
    const params = new URLSearchParams({
      redirect_uri: window.location.origin + window.location.pathname,
      client_id: 'pk_hprMp1nmhXOvJE7H', 
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('pollinations_api_key');
    window.dispatchEvent(new Event('storage'));
    setApiKey(null);
    if (onKeyChange) onKeyChange();
    toast.success('Koneksi diputuskan.');
  };

  if (apiKey) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-500/5 dark:bg-green-500/10 rounded-2xl border border-green-500/10 dark:border-green-500/20 shadow-sm">
        <div className="h-8 w-8 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500 shadow-inner">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-green-700 dark:text-green-500 uppercase tracking-widest leading-none mb-0.5">Pollen Connected</p>
          <p className="text-[10px] font-mono text-slate-400 dark:text-white/40 truncate italic">sk_••••{apiKey.slice(-4)}</p>
        </div>
        <button 
          onClick={handleDisconnect}
          className="p-2 hover:bg-red-500/10 text-slate-300 dark:text-white/20 hover:text-red-500 transition-all rounded-lg cursor-pointer"
          title="Putuskan"
        >
          <Unplug size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative group/byop w-full">
      <button 
        onClick={handleConnect}
        className="flex items-center gap-3 p-3 bg-white dark:bg-orange-500/5 hover:bg-slate-50 dark:hover:bg-orange-500/10 rounded-2xl border border-slate-200 dark:border-orange-500/20 transition-all w-full group shadow-lg shadow-slate-200/50 dark:shadow-none cursor-pointer"
      >
        <div className="h-8 w-8 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
          <Key size={18} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[9px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest leading-none mb-1">Gunakan Akun PRO</p>
          <p className="text-[10px] text-slate-500 dark:text-white/30 font-bold tracking-tight">Hubungkan kunci Pollinations</p>
        </div>
        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/20">
          <Info size={12} />
        </div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-4 w-72 p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl shadow-2xl opacity-0 invisible group-hover/byop:opacity-100 group-hover/byop:visible transition-all duration-300 z-[110] border border-slate-200 dark:border-white/10 backdrop-blur-xl">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-3 flex items-center gap-2">
          <Key size={12} /> Kenapa Hubungkan Akun?
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-[10px] text-slate-500 dark:text-white/60 font-medium">
            <span className="text-orange-500">•</span>
            <span>Akses Model PRO: <b className="text-slate-900 dark:text-white">Flux Pro, OpenAI, Grok, Wan Pro</b></span>
          </li>
          <li className="flex items-start gap-2 text-[10px] text-slate-500 dark:text-white/60 font-medium">
            <span className="text-orange-500">•</span>
            <span>Video Berkualitas Tinggi: <b className="text-slate-900 dark:text-white">Veo 3.1, LTX Video</b></span>
          </li>
          <li className="flex items-start gap-2 text-[10px] text-slate-500 dark:text-white/60 font-medium">
            <span className="text-orange-500">•</span>
            <span>Prioritas Antrean & Tanpa Watermark</span>
          </li>
        </ul>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
          <Github size={12} className="text-slate-300 dark:text-white/20" />
          <p className="text-[9px] text-slate-400 dark:text-white/30 italic leading-tight">
            Memerlukan saldo Pollen di akun Pollinations.ai Anda.
          </p>
        </div>
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border-r border-b border-slate-200 dark:border-white/10"></div>
      </div>
    </div>
  );
}
