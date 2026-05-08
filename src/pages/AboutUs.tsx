import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Target, Users, Sparkles, Facebook, ContactRound } from 'lucide-react';

const teamMembers = [
  { name: 'Koko Ajeeb', role: 'Founder & CEO', profileUrl: 'https://web.facebook.com/koko.ajeeb', imageUrl: '/author/img/koko-ajeeb.jpg' },
  { name: 'Xenopath', role: 'Admin', profileUrl: 'https://web.facebook.com/xenopati', imageUrl: '/author/img/xenopath.jpg' },
  { name: 'Yogi Arfianto', role: 'Admin', profileUrl: 'https://web.facebook.com/yogee.krib', imageUrl: '/author/img/yogi-profil.jpg' },
  { name: 'Famii', role: 'Admin', profileUrl: 'https://web.facebook.com/nengayu.hong', imageUrl: '/author/img/famii.jpg' },
  { name: 'Dery Lau', role: 'Admin', profileUrl: 'https://web.facebook.com/dery.megana', imageUrl: '/author/img/dery-lau.jpg' },
  { name: 'Paijem Ardian Arip', role: 'Admin', profileUrl: 'https://web.facebook.com/ardian.arip.2025', imageUrl: '/author/img/paijem.jpg' },
  { name: 'Mahidara Ratri', role: 'Admin', profileUrl: 'https://web.facebook.com/ruth.andanasari', imageUrl: '/author/img/mahidara.jpg' },
  { name: 'Nadifa Family', role: 'Admin', profileUrl: 'https://web.facebook.com/nadifa.familly', imageUrl: '/author/img/nadifa.jpg' },
  { name: 'Nurul Sholehah Eka', role: 'Admin', profileUrl: 'https://web.facebook.com/uul.aja', imageUrl: '/author/img/uul.jpg' },
  { name: 'Arif Tirtana', role: 'Kontributor', profileUrl: 'https://web.facebook.com/ayicktigabelas', imageUrl: '/author/img/arif.jpg' },
  { name: 'Hus', role: 'Admin', profileUrl: 'https://web.facebook.com/janseengan', imageUrl: '/author/img/hus.jpg' },
];

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] py-32 px-4 transition-colors duration-500 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="glass-card p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 -mr-20 -mt-20">
            <Sparkles size={300} />
          </div>
          
          <div className="inline-flex p-5 rounded-[2rem] bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-xl shadow-orange-500/5 relative z-10">
            <ContactRound size={48} />
          </div>
          <div className="space-y-6 relative z-10">
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-tight">
              Tentang <span className="text-orange-500">RuangRiung</span>
            </h1>
            <p className="text-lg md:text-2xl font-medium text-slate-600 dark:text-white/40 max-w-2xl mx-auto italic leading-relaxed">
              "Dari sebuah gambar terjalin sebuah persahabatan"
            </p>
          </div>
        </div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-card p-12 space-y-8 relative group">
            <h2 className="text-3xl font-black uppercase tracking-tight italic flex items-center gap-4 text-orange-500">
              <Heart size={32} fill="currentColor" /> Our Story
            </h2>
            <div className="space-y-6 text-lg text-slate-600 dark:text-white/60 leading-relaxed font-medium">
              <p>
                Semuanya berawal dari sebuah grup Facebook yang ramai, tempat canda tawa, semangat, dan ide-ide liar tak pernah ada habisnya. Kami adalah <strong className="text-slate-900 dark:text-white">RuangRiung</strong>, sebuah kolektif yang percaya bahwa kreativitas terbaik lahir dari kolaborasi, dukungan, dan sedikit kegilaan yang sehat.
              </p>
              <p>
                Studio AI ini adalah perwujudan dari semangat tersebut. Ini bukan sekadar alat; ini adalah kanvas digital yang kami bangun khusus untuk Anda, para pejuang kreatif yang ingin berkarya tanpa batas.
              </p>
            </div>
            <div className="pt-8">
              <a 
                href="https://web.facebook.com/groups/1182261482811767/" 
                target="_blank"
                rel="noopener"
                className="glass-button w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-xl shadow-blue-500/5"
              >
                <Facebook size={20} />
                Join Our Community
              </a>
            </div>
          </div>

          <div className="glass-card p-12 space-y-10 bg-slate-900/5 dark:bg-white/5">
            <h2 className="text-3xl font-black uppercase tracking-tight text-orange-500 italic flex items-center gap-4">
               <Target size={32} /> Our Mission
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Independent Creativity', desc: 'Memberdayakan Anda untuk mengubah imajinasi menjadi kenyataan tanpa hambatan teknis.' },
                { title: 'Digital Equality', desc: 'Menyediakan alat premium yang bisa diakses oleh siapa saja, di mana saja.' },
                { title: 'Continuous Growth', desc: 'Membangun ekosistem tempat kita bisa belajar, berbagi, dan bersenang-senang bersama.' }
              ].map((item) => (
                <div key={item.title} className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-2 hover:border-orange-500/30 transition-all group">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Collective */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center justify-center gap-6">
              <Users size={48} className="text-orange-500" /> Core <span className="text-orange-500">Collective</span>
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-white/30">The brains behind the Riung</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {teamMembers.map((member, index) => (
              <a 
                key={index} 
                href={member.profileUrl} 
                target="_blank" 
                rel="noopener"
                className="glass-card p-5 text-center group hover:scale-[1.05] active:scale-95 transition-all duration-300"
              >
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-orange-500/50 relative z-10"
                  />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white truncate mb-1">
                  {member.name}
                </h3>
                <p className="text-[8px] font-black uppercase tracking-tight text-slate-400 dark:text-white/30 truncate">
                  {member.role}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Back Navigation */}
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
