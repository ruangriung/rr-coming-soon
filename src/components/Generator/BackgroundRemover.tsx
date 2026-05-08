import React, { useState } from 'react';
import { Upload, Trash2, Download, Scissors, RefreshCw } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import toast from 'react-hot-toast';
import { saveToHistory } from '../../lib/history';

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (optional but recommended)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file terlalu besar (maks 10MB)');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResultImage(null);
        setProgress(0);
        setCurrentStep('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    setCurrentStep('Menyiapkan AI...');
    const toastId = toast.loading('Memuat model AI (ini mungkin memakan waktu)...');
    
    try {
      // removeBackground can take a URL, File, or Blob
      const blob = await removeBackground(image, {
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          setProgress(percent);
          setCurrentStep(key.replace(/_/g, ' '));
        }
      });
      
      const url = URL.createObjectURL(blob);
      setResultImage(url);
      
      // Save to history automatically
      try {
        await saveToHistory({
          type: 'image',
          blob: blob,
          prompt: 'AI Background Removal'
        });
      } catch (historyErr) {
        console.error('Failed to save to history:', historyErr);
      }

      toast.success('Latar belakang berhasil dihapus!', { id: toastId });
    } catch (error: any) {
      console.error('Background removal error:', error);
      toast.error(`Gagal: ${error.message || 'Pastikan koneksi internet stabil untuk memuat model.'}`, { id: toastId });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `rr-no-bg-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 md:p-10 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
              <Scissors size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight">BG Remover</h3>
              <p className="text-xs text-slate-500 dark:text-white/30 font-bold uppercase tracking-widest">Powered by On-Device AI</p>
            </div>
          </div>
          
          <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Status: Client-Side Processing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input Side */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Original Photo</label>
              {image && (
                <button 
                  onClick={() => { setImage(null); setResultImage(null); }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-black/20 group transition-all">
              {image ? (
                <img src={image} alt="Original" className="w-full h-full object-contain p-4" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/10 group-hover:text-orange-500 group-hover:scale-110 transition-all shadow-sm">
                    <Upload size={28} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-white/40">Drop or Click to Upload</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/20 mt-1 uppercase font-medium">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Result Side */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">AI Result</label>
            </div>
            <div className="relative aspect-square rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-slate-100 dark:bg-black/40 shadow-inner">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-6 px-8 w-full">
                  <div className="relative">
                    <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
                    <div className="absolute inset-0 blur-lg bg-orange-500/20 animate-pulse" />
                  </div>
                  <div className="text-center w-full space-y-3">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] animate-pulse">
                      {currentStep || 'Analyzing Pixels'}
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-white/20 uppercase font-bold">
                      {progress}% Complete
                    </p>
                  </div>
                </div>
              ) : resultImage ? (
                <>
                  <img src={resultImage} alt="Result" className="w-full h-full object-contain p-4 animate-in zoom-in-95 fade-in duration-500" />
                  <div className="absolute bottom-6 inset-x-6 flex justify-center">
                    <button 
                      onClick={handleDownload}
                      className="group flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:scale-105 transition-all shadow-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> 
                      Download PNG
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-10 grayscale">
                  <Scissors size={48} strokeWidth={1} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Processed Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
              <RefreshCw size={24} className={isProcessing ? 'animate-spin' : ''} />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Informasi Penggunaan AI</h4>
              <p className="text-xs text-slate-500 dark:text-white/40 font-medium leading-relaxed">
                Untuk pertama kali, browser akan mengunduh model AI (estimasi <span className="text-slate-900 dark:text-white font-bold">30-60 detik</span> tergantung koneksi). <br className="hidden md:block" />
                Selanjutnya, proses akan berjalan <span className="text-slate-900 dark:text-white font-bold">instan</span> karena data diproses secara lokal & aman di perangkat Anda.
              </p>
            </div>
          </div>

          <button
            onClick={handleRemoveBackground}
            disabled={!image || isProcessing}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl ${
              !image || isProcessing
              ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/10 cursor-not-allowed border border-transparent'
              : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-0.5 shadow-orange-500/20 active:scale-[0.98] border-b-4 border-orange-700'
            }`}
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Scissors size={18} />}
            {isProcessing ? 'Memproses dengan AI...' : 'Hapus Latar Belakang'}
          </button>
        </div>
      </div>
    </div>
  );
}
