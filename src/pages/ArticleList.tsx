import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User, Search } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function ArticleList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    console.log('Fetching articles...');
    fetch('/posts.json')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data artikel');
        return res.json();
      })
      .then(data => {
        console.log('Articles loaded:', data.length);
        setArticles(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (article.title?.toLowerCase().includes(searchLower)) ||
      (article.summary?.toLowerCase().includes(searchLower)) ||
      (article.category?.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] pb-24 pt-12 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            to="/generator"
            className="group inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium tracking-wide text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Studio
          </Link>

          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-full -z-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">
            Wawasan & Inspirasi AI
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none italic uppercase">
            Artikel <span className="text-orange-500">Terbaru</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500 dark:text-white/40 font-medium max-w-2xl mx-auto">
            Jelajahi panduan mendalam, tips produktivitas, dan berita terbaru seputar dunia AI untuk memperkuat alur kerja kreatif Anda.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-20 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={20} />
          <input
            type="text"
            placeholder="Cari panduan atau berita..."
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

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] bg-slate-100 dark:bg-white/5 rounded-3xl animate-pulse border border-slate-200 dark:border-white/10" />
            ))}
          </div>
        ) : (
          <>
            {filteredArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentArticles.map((article) => (
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
                      <div className="p-10 flex flex-col flex-grow">
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
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-tight mb-4 uppercase italic">
                          {article.title}
                        </h3>
                        <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                          {article.summary}
                        </p>
                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Baca Selengkapnya</span>
                          <BookOpen size={16} className="text-slate-300 dark:text-white/20 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
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
                <p className="text-slate-400 dark:text-white/20 font-black uppercase tracking-[0.3em]">Tidak ada artikel ditemukan</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
