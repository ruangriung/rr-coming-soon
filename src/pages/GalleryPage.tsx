import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Image as ImageIcon, Video, QrCode } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';
import { getHistory, removeFromHistory, clearHistory, HistoryItem } from '../lib/history';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [items, setItems] = useState<(HistoryItem & { objectUrl?: string })[]>([]);
  const urlsToRevoke = useRef<string[]>([]);

  useEffect(() => {
    loadHistory();
    return () => {
      // Cleanup object URLs when unmounting
      urlsToRevoke.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getHistory();
      const itemsWithUrls = history.map(item => {
        const url = URL.createObjectURL(item.blob);
        urlsToRevoke.current.push(url);
        return { ...item, objectUrl: url };
      });
      setItems(itemsWithUrls);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat koleksi');
    }
  };

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = items.find(i => i.id === id);
    if (item && item.objectUrl) {
      URL.revokeObjectURL(item.objectUrl);
      urlsToRevoke.current = urlsToRevoke.current.filter(u => u !== item.objectUrl);
    }
    
    await removeFromHistory(id);
    setItems(items.filter(i => i.id !== id));
    toast.success('Dihapus dari koleksi');
  };

  const handleClearAll = async () => {
    if (!window.confirm('Yakin ingin menghapus seluruh koleksi karya Anda?')) return;
    
    urlsToRevoke.current.forEach(url => URL.revokeObjectURL(url));
    urlsToRevoke.current = [];
    
    await clearHistory();
    setItems([]);
    toast.success('Semua koleksi berhasil dihapus');
  };

  const downloadItem = (item: HistoryItem & { objectUrl?: string }, e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.objectUrl) return;
    
    const a = document.createElement('a');
    const ext = item.type === 'video' ? 'mp4' : 'png';
    a.download = `rr-${item.type}-${item.timestamp}.${ext}`;
    a.href = item.objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-24 pt-12 px-4 transition-colors duration-500 font-sans selection:bg-orange-500/20">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium tracking-wide text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Beranda
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left relative">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-6">
              Koleksi <span className="text-slate-400 dark:text-[#666]">Karya.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-white/40 font-light max-w-2xl leading-relaxed">
              Semua gambar, video, dan QR Code yang Anda buat tersimpan dengan aman di browser lokal Anda. Tidak ada yang dikirim ke server.
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              Hapus Semua
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {items.length === 0 ? (
          <div className="w-full py-24 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 dark:text-white/20 mb-6">
              <ImageIcon size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">Koleksi Masih Kosong</h3>
            <p className="text-sm text-slate-500 dark:text-white/40 max-w-sm mb-8">
              Mulai buat gambar, video, atau QR Code. Hasil karya Anda akan otomatis muncul dan tersimpan di sini.
            </p>
            <Link 
              to="/generator"
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Buka Generator
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors"
              >
                {/* Media Container */}
                <div className="relative aspect-square w-full bg-slate-100 dark:bg-black/50 overflow-hidden flex items-center justify-center p-4">
                  {item.type === 'video' ? (
                    <video 
                      src={item.objectUrl} 
                      className="w-full h-full object-contain rounded-xl"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                  ) : (
                    <img 
                      src={item.objectUrl} 
                      alt={item.prompt || 'Generated item'} 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  )}
                  
                  {/* Badge Type */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold tracking-wider uppercase">
                    {item.type === 'image' && <><ImageIcon size={12} /> Gambar</>}
                    {item.type === 'video' && <><Video size={12} /> Video</>}
                    {item.type === 'qr' && <><QrCode size={12} /> QR Code</>}
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleRemove(item.id, e)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-500 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors" onClick={(e) => downloadItem(item, e)}>
                  <p className="text-xs text-slate-500 dark:text-white/40 mb-2 font-medium">
                    {new Date(item.timestamp).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white/90 line-clamp-2 leading-relaxed">
                    {item.prompt || 'Konten Khusus'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-orange-500 font-bold text-xs">
                    <span>Unduh File</span>
                    <ArrowLeft size={14} className="rotate-[225deg]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
