import React from 'react';
import Generator from '../components/Generator/Generator.tsx';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center bg-[#0a0a0a] border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 group text-[#888] hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#666]">Studio Active</span>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <Generator />
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl italic">RR<span className="text-orange-500">.</span></span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">© 2026 RuangRiung AI</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-orange-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
