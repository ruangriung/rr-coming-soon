import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Terminal, Search, ChevronRight, Zap } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';
import toast from 'react-hot-toast';

export default function PromptList() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    console.log('Fetching prompts...');
    fetch('/prompts-index.json')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat pustaka prompt');
        return res.json();
      })
      .then(data => {
        console.log('Prompts loaded:', data.length);
        setPrompts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt disalin!');
  };

  const filteredPrompts = prompts.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (p.title?.toLowerCase().includes(searchLower)) ||
      (p.content?.toLowerCase().includes(searchLower)) ||
      (p.tags?.some((t: string) => t.toLowerCase().includes(searchLower)))
    );
  });

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrompts = filteredPrompts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] pb-24 pt-12 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <Link
            to="/generator"
            className="group inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium tracking-wide text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali ke Studio
          </Link>

          <ThemeToggle />
        </div>

        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">
            Pustaka Kreatif
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none italic uppercase">
            Kumpulan <span className="text-orange-500">Prompt</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500 dark:text-white/40 font-medium max-w-2xl mx-auto">
            Gunakan koleksi prompt pilihan kami untuk menghasilkan karya AI yang luar biasa. Copy, paste, dan mulai berkarya.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-20 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={20} />
          <input
            type="text"
            placeholder="Cari prompt (contoh: anime, realism, landscape)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-slate-900 dark:text-white font-medium focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/10"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="text-center py-20 bg-red-500/5 border border-red-500/10 rounded-[3rem] mb-20">
            <p className="text-red-500 font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[250px] bg-slate-100 dark:bg-white/5 rounded-3xl animate-pulse border border-slate-200 dark:border-white/10" />
            ))}
          </div>
        ) : (
          <>
            {filteredPrompts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPrompts.map((item) => (
                    <div 
                      key={item.slug} 
                      className="group flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 hover:border-orange-500/30 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Terminal size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors uppercase italic">
                              {item.title}
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-white/20">Tool: {item.tool || 'Universal'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyPrompt(item.content)}
                          className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-orange-500 text-slate-400 dark:text-white/40 hover:text-white rounded-xl transition-all border border-slate-200 dark:border-white/10"
                        >
                          <Copy size={18} />
                        </button>
                      </div>
                      
                      <div className="relative mb-6">
                        <div className="p-6 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-white/60 text-sm font-medium leading-relaxed italic line-clamp-3">
                          "{item.content}"
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-white/20">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          to={`/kumpulan-prompt/${item.slug}`}
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          Detail <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 disabled:opacity-20 transition-all"
                    >
                      Sebelumnya
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-12 h-12 rounded-2xl text-[10px] font-black transition-all border ${
                            currentPage === page 
                              ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30 shadow-sm dark:shadow-none'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-6 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 disabled:opacity-20 transition-all"
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                <Search size={48} className="mx-auto text-slate-200 dark:text-white/5 mb-6" />
                <p className="text-slate-400 dark:text-white/20 font-black uppercase tracking-[0.3em]">Tidak ada prompt ditemukan</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
