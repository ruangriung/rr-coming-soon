import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowLeft, ExternalLink, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] py-32 px-4 transition-colors duration-500 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Card */}
        <div className="glass-card p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
             <Globe size={120} />
          </div>
          
          <div className="inline-flex p-5 rounded-[2rem] bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-xl shadow-orange-500/5">
            <Mail size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-tight">
              Hubungi <span className="text-orange-500">Kami</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-white/40 max-w-md mx-auto">
              Punya pertanyaan atau butuh bantuan? Kami siap mendengarkan energi kreatif Anda.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-10 space-y-8">
              <h3 className="text-lg font-black uppercase tracking-tight italic text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 pb-4">Info Kontak</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Email Official</p>
                  <a href="mailto:admin@ruangriung.my.id" className="text-sm font-bold text-orange-500 hover:underline block truncate group transition-all">
                    admin@ruangriung.my.id
                    <ExternalLink size={12} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Komunitas Hub</p>
                  <a href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener" className="text-sm font-bold text-orange-500 hover:underline block group transition-all">
                    RuangRiung Group
                    <ExternalLink size={12} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8 bg-orange-500/5 border-orange-500/20">
              <p className="text-xs font-medium text-slate-600 dark:text-white/60 leading-relaxed italic">
                "Setiap masukan Anda adalah energi bagi kami untuk terus berinovasi dan membangun ekosistem kreatif yang lebih baik."
              </p>
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="lg:col-span-2">
            <div className="glass-card h-full p-12 flex flex-col items-center justify-center text-center space-y-10">
              <div className="h-24 w-24 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <MessageSquare size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white italic">Kirim Pesan Langsung</h3>
                <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed max-w-md mx-auto">
                  Kami lebih menyukai komunikasi langsung melalui email untuk respon yang lebih cepat dan terorganisir.
                </p>
              </div>
              <a
                href="mailto:admin@ruangriung.my.id?subject=Pertanyaan dari RuangRiung AI"
                className="w-full max-w-xs glass-button py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-orange-500/10"
              >
                <Mail size={18} />
                Kirim via Email
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center pt-8">
          <Link 
            to="/" 
            className="group glass-button px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-5 text-slate-500 dark:text-white/60 hover:text-orange-500 hover:border-orange-500/30 transition-all backdrop-blur-xl"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
