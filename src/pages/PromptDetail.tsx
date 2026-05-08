import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, User, Calendar, Terminal, Zap, ChevronLeft, ChevronRight, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { parseMarkdown } from '../lib/markdown';
import ThemeToggle from '../components/UI/ThemeToggle';
import toast from 'react-hot-toast';

export default function PromptDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [prompt, setPrompt] = useState<any>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    console.log('Loading prompt:', slug);
    setIsLoading(true);
    setError(null);

    // Fetch related prompts
    fetch('/prompts-index.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const current = data.find((p: any) => p.slug === slug);
          if (current) {
            const related = data
              .filter((p: any) => (p.tool === current.tool || p.tags?.some((t: string) => current.tags?.includes(t))) && p.slug !== slug)
              .slice(0, 3);
            setRelatedPrompts(related);
          }
        }
      })
      .catch(err => console.warn('Related prompts error:', err));
    
    fetch(`/content/prompts/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Prompt tidak ditemukan');
        return res.text();
      })
      .then(md => {
        const parsed = parseMarkdown(md, slug);
        setPrompt(parsed);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Prompt load error:', err);
        setError(err.message);
        setIsLoading(false);
        setTimeout(() => navigate('/kumpulan-prompt'), 3000);
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
      <p className="text-slate-400 dark:text-white/40 mb-8 max-w-xs mx-auto">Kami tidak dapat menemukan prompt yang Anda cari. Mengalihkan kembali...</p>
      <Link to="/kumpulan-prompt" className="px-8 py-3 bg-orange-500 text-white font-black uppercase tracking-widest rounded-full text-[10px] shadow-xl shadow-orange-500/20 active:scale-95 transition-all">Pustaka Prompt</Link>
    </div>
  );

  if (!prompt) return null;

  const copyToClipboard = () => {
    // Content is either in prompt.content (from posts.json) or prompt.contentHtml (parsed from md)
    // Actually, for prompts, we usually want the raw prompt string
    const rawContentMatch = prompt.contentHtml?.match(/<p.*?>"(.*?)"<\/p>/);
    const contentToCopy = rawContentMatch ? rawContentMatch[1] : (prompt.content || '');
    
    navigator.clipboard.writeText(contentToCopy);
    toast.success('Prompt disalin ke clipboard!');
  };

  const shareUrl = window.location.href;
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Tautan disalin!');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] pb-32 pt-32 px-6 selection:bg-orange-500/30 relative overflow-hidden transition-colors duration-500">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link 
            to="/kumpulan-prompt"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 border border-slate-200 dark:border-white/10 transition-all backdrop-blur-xl"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Kembali ke Pustaka
          </Link>

          <ThemeToggle />
        </div>

        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                {prompt.tool || 'UNIVERSAL AI'}
              </span>
              <span className="px-5 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                ID: #{prompt.id || 'N/A'}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-normal leading-tight italic uppercase">
              {prompt.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                <User size={16} className="text-orange-500" />
                {prompt.author}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
                <Calendar size={16} className="text-orange-500" />
                {prompt.date ? new Date(prompt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Prompt Content Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-[#ffffff] dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-3 text-orange-500">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Zap size={22} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Engine Optimized</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                >
                  Salin Prompt
                </button>
              </div>

              <div 
                className="prose-container bg-slate-50 dark:bg-white/[0.03] p-10 rounded-3xl border border-slate-100 dark:border-white/5 italic font-mono text-slate-700 dark:text-white/80"
                dangerouslySetInnerHTML={{ __html: prompt.contentHtml }}
              />

              <div className="flex flex-wrap gap-2 mt-10">
                {prompt.tags?.map((tag: string) => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem]">
             <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-4">Catatan Penggunaan</h4>
             <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed font-medium">
              Gunakan prompt ini pada model <span className="text-slate-900 dark:text-white font-bold">{prompt.tool || 'Generative AI'}</span>. Sesuaikan bagian subjek untuk mendapatkan hasil yang lebih personal. Bagikan hasil karya Anda dengan tag #RuangRiungAI.
             </p>
          </div>
        </div>

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <div className="mt-32 pt-32 border-t border-slate-200 dark:border-white/5">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-12">Prompt <span className="text-orange-500">Terkait</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPrompts.map((item) => (
                <Link key={item.slug} to={`/kumpulan-prompt/${item.slug}`} className="p-8 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-[2rem] hover:border-orange-500/30 transition-all group shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <span className="text-[8px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest block mb-4">{item.tool}</span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors uppercase italic mb-4 line-clamp-2">{item.title}</h4>
                  <ChevronRight size={16} className="text-slate-300 dark:text-white/20 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
