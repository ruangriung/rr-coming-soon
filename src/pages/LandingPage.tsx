import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Video, Image as ImageIcon, BookOpen, Key, ArrowRight, Clock, User } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function LandingPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    setYear(new Date().getFullYear());
    
    // Fetch recent articles
    fetch('/posts.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          // Get top 3 articles
          setRecentArticles(data.slice(0, 3));
        }
      })
      .catch(err => console.error('Failed to fetch articles', err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] text-slate-900 dark:text-[#f0f0f0] font-sans selection:bg-orange-500/20 transition-colors duration-500 flex flex-col relative overflow-hidden border-8 border-slate-200 dark:border-[#1a1a1a]">
      {/* Decorative Grid Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header Section */}
      <header className="p-8 md:p-12 flex justify-between items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-[#666] mb-2 font-semibold font-sans">
            Digital Home / Ruang Temu
          </div>
          <h1 className="text-2xl font-light tracking-tighter text-slate-900 dark:text-white">
            ruangriung<span className="text-slate-400 dark:text-[#666]">.my.id</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <ThemeToggle />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-6 md:px-12 py-12 flex flex-col flex-grow relative z-10 max-w-7xl mx-auto w-full space-y-32">
        
        {/* HERO SECTION */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mt-12 md:mt-24 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-sm mb-8">
            <Sparkles size={12} className="text-orange-500" />
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest italic">All-in-One AI Platform</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[80px] font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none mb-8">
            <span className="text-orange-500">RuangRiung</span> AI Studio
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-500 dark:text-white/40 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Ekosistem Kecerdasan Buatan Terpadu oleh RuangRiung. Hasilkan gambar memukau, video sinematik, dan jelajahi wawasan teknologi AI terkini dalam satu platform yang inklusif dan berkelanjutan.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/generator" 
              className="group flex items-center justify-center gap-3 px-8 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] w-full sm:w-auto"
            >
              <Sparkles size={20} />
              Mulai Berkarya Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.section>

        {/* BENTO GRID FEATURES */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest italic">Fitur Studio</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/generator" className="group p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] hover:border-orange-500/50 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest italic mb-4">AI Image</h4>
              <p className="text-slate-500 dark:text-white/40 font-medium leading-relaxed mb-8 flex-grow">
                Hasilkan gambar fotorealistik, seni digital, dan ilustrasi menakjubkan hanya dari deskripsi teks sederhana menggunakan model tercanggih.
              </p>
              <div className="flex items-center justify-between text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                <span>Coba Sekarang</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/generator" className="group p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] hover:border-orange-500/50 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                <Video size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest italic mb-4">AI Video</h4>
              <p className="text-slate-500 dark:text-white/40 font-medium leading-relaxed mb-8 flex-grow">
                Wujudkan adegan sinematik dan animasi bergerak dari imajinasi Anda. Didukung oleh mesin generasi video mutakhir.
              </p>
              <div className="flex items-center justify-between text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                <span>Coba Sekarang</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link to="/kumpulan-prompt" className="group p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] hover:border-orange-500/50 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform">
                <BookOpen size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-widest italic mb-4">Prompt Library</h4>
              <p className="text-slate-500 dark:text-white/40 font-medium leading-relaxed mb-8 flex-grow">
                Eksplorasi ribuan ide prompt premium yang siap digunakan. Simpan, salin, dan modifikasi untuk hasil maksimal.
              </p>
              <div className="flex items-center justify-between text-orange-500 font-bold text-[10px] uppercase tracking-widest">
                <span>Lihat Koleksi</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* LATEST ARTICLES */}
        {recentArticles.length > 0 && (
          <section className="space-y-12">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest italic">Artikel Terkini</h3>
              </div>
              <Link to="/artikel" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors hidden sm:flex items-center gap-2">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <Link 
                  key={article.slug} 
                  to={`/artikel/${article.slug}`}
                  className="group flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all hover:-translate-y-2 shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={article.image || "/assets/ruangriung.png"} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-80"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-orange-500" />
                        {article.date ? new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                      <div className="w-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-orange-500" />
                        {article.author}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-tight mb-4 uppercase italic">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                      {article.summary}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Baca Selengkapnya</span>
                      <ArrowRight size={14} className="text-slate-300 dark:text-white/20 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <Link to="/artikel" className="sm:hidden flex items-center justify-center gap-2 w-full py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/60">
              Lihat Semua Artikel <ArrowRight size={14} />
            </Link>
          </section>
        )}

        {/* BYOP INFO SECTION */}
        <section className="bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 text-green-600 dark:text-green-500">
                <Key size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Akses Tanpa Batas</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Bring Your Own <span className="text-orange-500">Pollen</span></h3>
              <p className="text-slate-500 dark:text-white/40 font-medium leading-relaxed max-w-2xl">
                Bagi Anda yang membutuhkan produksi dalam skala besar, Anda dapat menghubungkan API Key dari Pollinations secara langsung. Dengan fitur <strong>BYOP</strong>, Anda bisa mengakses model-model premium tanpa terikat batasan server kami.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/generator" className="px-6 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-gray-200 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer">
                  Hubungkan Key
                </Link>
                <a href="https://enter.pollinations.ai" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer flex items-center gap-2">
                  Dapatkan Key <ArrowRight size={12} />
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="absolute inset-0 border-4 border-dashed border-green-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 bg-slate-900 dark:bg-[#111] border border-slate-700 dark:border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                  <Key size={48} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Aesthetic Footer */}
      <footer className="border-t border-slate-200 dark:border-[#1a1a1a] bg-slate-50 dark:bg-[#0d0d0d] p-8 relative z-10 transition-colors duration-500 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#444] font-bold">Server Status</span>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-green-500/30 dark:bg-green-900/30"></div>
                <span className="text-[11px] font-mono text-green-600 tracking-tighter">ONLINE_AND_READY</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#444] font-bold">Engine State</span>
              <div className="flex items-center gap-3">
                <div className="flex-grow bg-slate-200 dark:bg-[#1a1a1a] h-1 max-w-[100px] overflow-hidden relative">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" 
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#888] animate-pulse">ACTIVE</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#444] font-bold">Version</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#888]">v2.1.0-STABLE</span>
            </div>

            <div className="flex flex-col gap-2 md:text-right md:items-end">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#444] font-bold">Inquiries</span>
              <span className="text-[11px] font-mono text-slate-700 dark:text-[#FFF] underline decoration-slate-300 dark:decoration-[#333] underline-offset-4 hover:decoration-orange-500 dark:hover:decoration-[#666] transition-all cursor-pointer">
                admin@ruangriung.my.id
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-[#151515] flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-[#333] font-medium">
              <Link to="/kebijakan-privasi" className="hover:text-orange-500 transition-colors cursor-pointer">Privacy</Link>
              <Link to="/ketentuan-layanan" className="hover:text-orange-500 transition-colors cursor-pointer">Terms</Link>
              <Link to="/penghapusan-data" className="hover:text-orange-500 transition-colors cursor-pointer">Data</Link>
              <Link to="/tentang-kami" className="hover:text-orange-500 transition-colors cursor-pointer">About</Link>
              <Link to="/kontak" className="hover:text-orange-500 transition-colors cursor-pointer">Contact</Link>
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 dark:text-[#333] font-medium text-center sm:text-right">&copy; {year} Ruang Riung Creative Community</span>
          </div>
        </div>
      </footer>

      {/* Large Faded Background Number */}
      <div className="absolute bottom-[-20px] right-[-50px] text-[350px] font-bold text-slate-900 dark:text-white opacity-[0.015] dark:opacity-[0.015] leading-none select-none pointer-events-none font-serif italic">
        RR
      </div>
    </div>
  );
}
