import React, { useState, useRef, useEffect } from 'react';
import { Image, Sparkles, Upload, Cpu, X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

import ButtonSpinner from './ButtonSpinner.tsx';

export default function ImageAnalysisAssistant({ onPaymentRequired }: { onPaymentRequired?: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult('');
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Silakan unggah gambar terlebih dahulu!");
      return;
    }
    setIsLoading(true);
    setAnalysisResult('');

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const response = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ 
              role: "user", 
              content: [
                { type: "text", text: "Jelaskan gambar ini secara detail untuk dijadikan prompt AI generator gambar. Berikan deskripsi subjek, pencahayaan, gaya seni, dan warna." }, 
                { type: "image_url", image_url: { url: base64String } }
              ] 
            }],
            model: 'openai'
          }),
        });

        if (response.status === 402) {
          if (onPaymentRequired) onPaymentRequired();
          return;
        }

        if (!response.ok) throw new Error();
        const description = await response.text();
        setAnalysisResult(description);
        toast.success("Analisis selesai!");
      } catch (err) {
        toast.error("Gagal menganalisis gambar.");
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">Analisis Visual</label>
              {selectedFile && (
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); setAnalysisResult(''); }}
                  className="px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-400 dark:text-white/40 hover:text-red-500 rounded-lg border border-slate-200 dark:border-white/10 transition-all text-[9px] font-black uppercase tracking-widest"
                >
                  Hapus
                </button>
              )}
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-[2.5rem] bg-white dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all relative overflow-hidden group shadow-2xl shadow-slate-200/50 dark:shadow-none"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <p className="text-[10px] font-black text-white uppercase">Ganti Gambar</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/20">
                    <Upload size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Pilih gambar dari perangkat</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !selectedFile}
            className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <ButtonSpinner />
                <span>Menganalisis...</span>
              </div>
            ) : (
              <>
                <Cpu size={20} /> Mulai Analisis
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex-1 min-h-[300px] p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 relative shadow-inner">
              {analysisResult ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <p className="text-slate-700 dark:text-white/80 text-xs font-medium leading-relaxed">{analysisResult}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(analysisResult);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                      toast.success("Prompt disalin!");
                    }}
                    className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />} {isCopied ? 'Tersalin' : 'Salin Hasil'}
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <p className="text-[10px] font-black text-slate-300 dark:text-white/10 uppercase tracking-widest italic">Belum ada hasil analisis</p>
                </div>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-3xl">
                  <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
