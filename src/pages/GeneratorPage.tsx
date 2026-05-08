import React from 'react';
import Generator from '../components/Generator/Generator.tsx';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] text-slate-900 dark:text-white selection:bg-orange-500/30 transition-colors duration-500">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-6 flex justify-between items-center bg-[#fcfcfc]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
        <Link to="/" className="flex items-center gap-2 group text-slate-400 dark:text-[#888] hover:text-slate-900 dark:hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#666]">Studio Active</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <Generator />
      </main>

      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl italic text-slate-900 dark:text-white">RR<span className="text-orange-500">.</span></span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">© 2026 RuangRiung AI</span>
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
