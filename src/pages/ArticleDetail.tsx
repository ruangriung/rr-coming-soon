import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Facebook, Twitter, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseMarkdown } from '../lib/markdown';
import ThemeToggle from '../components/UI/ThemeToggle';
import toast from 'react-hot-toast';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    
    console.log('Loading article:', slug);
    setIsLoading(true);
    setError(null);

    // Fetch related articles
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const current = data.find((a: any) => a.slug === slug);
          if (current) {
            const related = data
              .filter((a: any) => (a.category === current.category || a.tags?.some((t: any) => current.tags?.includes(t))) && a.slug !== slug)
              .slice(0, 3);
            setRelatedArticles(related);
          }
        }
      })
      .catch(err => console.warn('Related articles error:', err));

    fetch(`/content/articles-md/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Artikel tidak ditemukan');
        return res.text();
      })
      .then(md => {
        const parsed = parseMarkdown(md, slug);
        console.log('Parsed article content length:', parsed.contentHtml?.length);
        setArticle(parsed);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Article load error:', err);
        setError(err.message);
        setIsLoading(false);
        setTimeout(() => navigate('/artikel'), 3000);
      });
  }, [slug, navigate]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-500">
      <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center transition-colors duration-500">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tighter">Oops! {error}</h2>
      <p className="text-slate-400 dark:text-white/40 mb-8 max-w-xs mx-auto">Kami tidak dapat menemukan artikel yang Anda cari. Mengalihkan kembali...</p>
      <Link to="/artikel" className="px-8 py-3 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full text-[10px] shadow-xl shadow-orange-500/20 active:scale-95 transition-all">Kembali ke Blog</Link>
    </div>
  );

  if (!article) return null;

  const shareUrl = window.location.href;
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Tautan disalin!');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] pb-32 pt-32 px-6 selection:bg-orange-500/30 relative transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link 
            to="/artikel"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 border border-slate-200 dark:border-white/10 transition-all backdrop-blur-xl"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
            Beranda Artikel
          </Link>

          <ThemeToggle />
        </div>

        {/* Header Content */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-orange-500/10">
              {article.category}
            </span>
            <div className="h-px flex-grow bg-slate-200 dark:bg-white/10" />
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-normal leading-tight italic uppercase">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
              <User size={16} className="text-orange-500" />
              {article.author}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
              <Clock size={16} className="text-orange-500" />
              {article.date ? new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="space-y-12">
          {/* Summary Box */}
          <div className="p-8 md:p-12 bg-orange-500/5 dark:bg-orange-500/10 border-l-4 border-orange-500 rounded-r-[2.5rem] relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-xl md:text-2xl text-slate-700 dark:text-white font-medium italic leading-relaxed tracking-wide">
                {article.summary}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          {article.image && article.image !== "/assets/ruangriung.png" && (
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Main Content Rendered */}
          <div 
            className="prose-container mt-12 text-slate-600 dark:text-white/70"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Tags Cloud */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-16 border-t border-slate-200 dark:border-white/5">
              {article.tags.map((tag: string) => (
                <span key={tag} className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest hover:border-orange-500/30 hover:text-slate-900 dark:hover:text-white transition-all">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Share Section */}
        <div className="mt-24 p-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">Suka Artikel Ini?</h4>
            <p className="text-slate-400 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">Bagikan wawasan ini ke jaringan Anda.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={copyLink} className="w-14 h-14 bg-white dark:bg-white/5 hover:bg-orange-500 text-slate-400 dark:text-white rounded-2xl flex items-center justify-center transition-all border border-slate-200 dark:border-white/10 active:scale-95 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <LinkIcon size={20} />
            </button>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener" className="w-14 h-14 bg-white dark:bg-white/5 hover:bg-blue-400 text-slate-400 dark:text-white rounded-2xl flex items-center justify-center transition-all border border-slate-200 dark:border-white/10 active:scale-95 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <Twitter size={20} />
            </a>
            <a href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="w-14 h-14 bg-white dark:bg-white/5 hover:bg-blue-600 text-slate-400 dark:text-white rounded-2xl flex items-center justify-center transition-all border border-slate-200 dark:border-white/10 active:scale-95 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-40">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Wawasan <span className="text-orange-500">Lainnya</span></h3>
              <Link to="/artikel" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-orange-500 transition-all">Lihat Semua &rarr;</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedArticles.map((item) => (
                <Link key={item.slug} to={`/artikel/${item.slug}`} className="group flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 relative mb-6">
                    <img src={item.image || "/assets/ruangriung.png"} alt={item.title} className="w-full h-full object-cover opacity-80 dark:opacity-60 transition-all group-hover:scale-110 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc] dark:from-[#0a0a0a] to-transparent opacity-60" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors uppercase leading-tight italic line-clamp-2">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
