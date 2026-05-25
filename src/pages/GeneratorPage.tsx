import React from 'react';
import Generator from '../components/Generator/Generator.tsx';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GeneratorPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] text-slate-900 dark:text-white selection:bg-orange-500/30 transition-colors duration-500">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] pl-4 pr-16 md:pl-6 md:pr-22 py-4 md:py-6 flex justify-between items-center bg-[#fcfcfc]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md transform-gpu border-b border-slate-200 dark:border-white/10">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium tracking-wide text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#666]">Studio Active</span>
          </div>
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
              <img 
                src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                alt={user.name} 
                className="h-8 w-8 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-white/80 line-clamp-1 max-w-[120px]">{user.name}</span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-white/40 line-clamp-1 max-w-[120px]">{user.email}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 bg-slate-100 hover:bg-red-500/10 dark:bg-white/5 hover:dark:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer shadow-sm border border-slate-200/50 dark:border-white/5"
                title="Keluar dari akun"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <Generator />
      </main>

      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl italic text-slate-900 dark:text-white">RR<span className="text-orange-500">.</span></span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">© 2026 RuangRiung AI Generator</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <Link to="/artikel" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-orange-500 transition-colors">Blog</Link>
            <Link to="/kumpulan-prompt" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-orange-500 transition-colors">Prompts</Link>
            <Link to="/tentang-kami" className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-orange-500 transition-colors">About</Link>
            <Link to="/kebijakan-privasi" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 hover:text-orange-500 transition-colors">Privacy</Link>
            <Link to="/ketentuan-layanan" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 hover:text-orange-500 transition-colors">Terms</Link>
            <Link to="/kontak" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 hover:text-orange-500 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
