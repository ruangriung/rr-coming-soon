import React, { memo } from 'react';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageDisplayProps {
  isLoading: boolean;
  imageUrls: string[];
}

const ImageDisplay = memo(({ isLoading, imageUrls }: ImageDisplayProps) => {
  const handleDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruangriung-ai-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Gambar berhasil diunduh!");
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-white/5 rounded-[2.5rem] overflow-hidden border-2 border-slate-200 dark:border-white/10 group shadow-2xl shadow-slate-200/50 dark:shadow-none">
        {imageUrls.length > 0 ? (
          <img 
            src={imageUrls[0]} 
            alt="AI Generated" 
            className="w-full h-full object-contain"
          />
        ) : !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 rounded-[2rem] bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 shadow-lg shadow-orange-500/10">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 italic uppercase tracking-tighter">Hasil Gambar Akan Muncul Disini</h3>
            <p className="text-slate-500 dark:text-white/40 font-medium max-w-xs">
              Atur parameter dan klik tombol Generate untuk melihat keajaiban terjadi.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-orange-500" size={32} />
              </div>
            </div>
            <p className="mt-8 text-slate-900 dark:text-white font-black uppercase tracking-[0.4em] text-[10px]">
              Generating Visual...
            </p>
          </div>
        )}
      </div>

      {imageUrls.length > 0 && !isLoading && (
        <div className="flex justify-center">
          <button 
            onClick={() => handleDownload(imageUrls[0])}
            className="h-14 px-8 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-orange-500 border border-slate-200 dark:border-white/10 rounded-2xl transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-lg cursor-pointer"
          >
            <Download size={20} />
            Download Hasil
          </button>
        </div>
      )}
    </div>
  );
});

ImageDisplay.displayName = 'ImageDisplay';
export default ImageDisplay;
