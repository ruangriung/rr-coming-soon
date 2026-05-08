import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Video, Image as ImageIcon, BookOpen, Key, ArrowRight, QrCode } from 'lucide-react';
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
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-[#f0f0f0] font-sans selection:bg-orange-500/20 transition-colors duration-500 flex flex-col relative">
      
      {/* Navbar */}
      <header className="px-6 md:px-12 py-8 flex justify-between items-center relative z-20 max-w-[1400px] w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <div className="text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-[#666] mb-1 font-medium">
            RuangRiung AI Studio
          </div>
          <h1 className="text-xl font-light tracking-tight text-slate-900 dark:text-white">
            ruangriung<span className="text-slate-400 dark:text-[#666]">.my.id</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6"
        >
          <Link to="/generator" className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors">
            Studio
          </Link>
          <Link to="/kumpulan-prompt" className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">
            Prompts
          </Link>
          <ThemeToggle />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-grow relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-24 space-y-32">
        
        {/* HERO SECTION */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-20 md:pt-32 flex flex-col items-center md:items-start text-center md:text-left relative"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-slate-600 dark:text-white/60 uppercase tracking-widest">Sistem Online & Siap</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-[50px] md:text-[80px] leading-[1.05] font-light tracking-tight text-slate-900 dark:text-white mb-6">
            Ekosistem AI <br className="hidden md:block" />
            <span className="text-slate-400 dark:text-[#666] font-serif italic font-normal tracking-normal text-[55px] md:text-[85px]">Untuk kreator.</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-base md:text-lg text-slate-500 dark:text-white/40 font-light max-w-2xl mb-12 leading-relaxed">
            Akses model kecerdasan buatan terdepan untuk menghasilkan gambar fotorealistik dan video sinematik dalam satu ruang kerja yang profesional dan minimalis.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/generator" 
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium tracking-widest uppercase rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98]"
            >
              Mulai Berkarya
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/kumpulan-prompt" 
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 text-xs font-medium tracking-widest uppercase rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
            >
              Jelajahi Prompts
            </Link>
          </motion.div>
        </motion.section>

        {/* FEATURES GRID */}
        <section className="space-y-12 border-t border-slate-200/60 dark:border-white/5 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-light tracking-tight mb-2">Perangkat Profesional</h3>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light">Semua yang Anda butuhkan untuk produksi digital.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/generator" className="group p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60 mb-8 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <ImageIcon size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-medium mb-3">AI Image Studio</h4>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light leading-relaxed mb-8 flex-grow">
                Generator gambar presisi tinggi dengan dukungan model terbaru untuk resolusi dan detail maksimal.
              </p>
              <div className="flex items-center text-xs font-medium text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>Akses Tool</span>
                <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>

            <Link to="/generator" className="group p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60 mb-8 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <Video size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-medium mb-3">AI Video Creator</h4>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light leading-relaxed mb-8 flex-grow">
                Ubah narasi teks dan gambar statis menjadi runtutan video sinematik dengan rendering cepat.
              </p>
              <div className="flex items-center text-xs font-medium text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>Akses Tool</span>
                <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>

            <Link to="/kumpulan-prompt" className="group p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60 mb-8 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-medium mb-3">Prompt Library</h4>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light leading-relaxed mb-8 flex-grow">
                Repositori terkurasi yang berisi prompt arsitektural dan instruksi spesifik untuk hasil optimal.
              </p>
              <div className="flex items-center text-xs font-medium text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>Jelajahi Pustaka</span>
                <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>

            <Link to="/qr-generator" className="group p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60 mb-8 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <QrCode size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-medium mb-3">QR Generator</h4>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light leading-relaxed mb-8 flex-grow">
                Buat QR Code dengan kustomisasi logo dan warna untuk kebutuhan distribusi tautan Anda.
              </p>
              <div className="flex items-center text-xs font-medium text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>Akses Tool</span>
                <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          </div>
        </section>

        {/* BYOP INFO SECTION */}
        <section className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 text-slate-500 dark:text-white/50">
                <Key size={16} strokeWidth={1.5} />
                <span className="text-[10px] font-medium uppercase tracking-widest">Enterprise Ready</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight">Bring Your Own Pollen (BYOP)</h3>
              <p className="text-sm text-slate-500 dark:text-white/40 font-light leading-relaxed max-w-xl">
                Bagi profesional yang membutuhkan produksi visual berskala besar, hubungkan API Key Pollinations Anda secara langsung ke platform ini. Akses model tier premium dan hilangkan batasan batas generasi pada server publik.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/generator" className="px-6 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white text-xs font-medium tracking-wide rounded-lg transition-colors cursor-pointer">
                  Setup API Key
                </Link>
                <a href="https://enter.pollinations.ai" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white text-xs font-medium tracking-wide transition-colors cursor-pointer flex items-center gap-2">
                  Dapatkan Akses Pro <ArrowRight size={14} />
                </a>
              </div>
            </div>
            
            {/* Visual Abstract */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end opacity-80">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 border border-slate-200 dark:border-white/10 rounded-full animate-[spin_15s_linear_infinite]" />
                <div className="absolute inset-4 border border-dashed border-slate-200 dark:border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-white/10">
                  <Key size={32} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES */}
        {recentArticles.length > 0 && (
          <section className="space-y-12 pb-12">
            <div className="flex items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-light tracking-tight">Jurnal & Pembaruan</h3>
              </div>
              <Link to="/artikel" className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                Semua Artikel <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="flex flex-col">
              {recentArticles.map((article, index) => (
                <Link 
                  key={article.slug} 
                  to={`/artikel/${article.slug}`}
                  className={`group flex items-center justify-between py-6 ${index !== recentArticles.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''} hover:px-4 transition-all`}
                >
                  <div className="flex items-center gap-8 truncate">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-white/30 min-w-[80px]">
                      {article.date ? new Date(article.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-white/80 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 dark:text-white/20 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-[#151515] bg-white dark:bg-[#080808] py-12 px-6 md:px-12 relative z-10 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-medium tracking-widest text-slate-400 dark:text-[#666] uppercase">RuangRiung Studio</span>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-[#888]">Semua sistem berjalan normal</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#555] font-medium">
            <Link to="/kebijakan-privasi" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/ketentuan-layanan" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/tentang-kami" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            <a href="mailto:admin@ruangriung.my.id" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-[#444] font-medium">
            &copy; {year} RuangRiung.
          </div>
        </div>
      </footer>
    </div>
  );
}
