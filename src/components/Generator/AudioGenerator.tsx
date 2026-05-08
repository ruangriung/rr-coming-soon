import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, Play, Pause, Download, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AudioGenerator({ onPaymentRequired }: { onPaymentRequired?: () => void }) {
  const [text, setText] = useState('Selamat datang di RuangRiung AI Studio. Ciptakan suara masa depan Anda di sini.');
  const [voices, setVoices] = useState<string[]>(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handlePreviewVoice = async (voice: string) => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }

    if (previewingVoice === voice) {
      setPreviewingVoice(null);
      return;
    }

    setPreviewingVoice(voice);
    try {
      const params = new URLSearchParams({ text: 'Ini adalah contoh suara.', voice });
      const response = await fetch(`/api/generate-audio?${params.toString()}`);
      
      if (response.status === 402) {
        if (onPaymentRequired) onPaymentRequired();
        throw new Error('Payment Required');
      }
      
      if (!response.ok) throw new Error();
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioPreviewRef.current = audio;
      audio.play();
      audio.onended = () => setPreviewingVoice(null);
    } catch (e) {
      if (e.message !== 'Payment Required') {
        toast.error("Gagal memutar pratinjau.");
      }
      setPreviewingVoice(null);
    }
  };

  const handleGenerate = async () => {
    if (!text) {
      toast.error('Teks tidak boleh kosong!');
      return;
    }
    setIsLoading(true);
    setAudioUrl(null);

    try {
      const params = new URLSearchParams({ text, voice: selectedVoice });
      const response = await fetch(`/api/generate-audio?${params.toString()}`);
      
      if (response.status === 402) {
        if (onPaymentRequired) onPaymentRequired();
        return;
      }
      
      if (!response.ok) throw new Error('Gagal membuat audio');
      
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
      toast.success("Audio berhasil dibuat!");
    } catch (error: any) {
      toast.error("Gagal membuat audio.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
             <label className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">Narasi Suara</label>
             <button 
                onClick={() => setText('')}
                className="px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-400 dark:text-white/40 hover:text-red-500 rounded-lg border border-slate-200 dark:border-white/10 transition-all text-[9px] font-black uppercase tracking-widest cursor-pointer"
                title="Bersihkan"
              >
                Bersihkan
              </button>
          </div>
          <textarea
            className="w-full h-40 p-6 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-medium outline-none resize-none leading-relaxed placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner"
            placeholder="Tuliskan apa yang ingin Anda ubah menjadi suara..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Pilih Karakter Suara</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {voices.map((voice) => (
              <button
                key={voice}
                onClick={() => setSelectedVoice(voice)}
                className={`relative p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 cursor-pointer ${
                  selectedVoice === voice
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:border-orange-500/50'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{voice}</span>
                <div 
                  onClick={(e) => { e.stopPropagation(); handlePreviewVoice(voice); }}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    selectedVoice === voice ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {previewingVoice === voice ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !text}
          className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Memproses Suara...</span>
            </div>
          ) : (
            <>
              <Volume2 size={20} /> Generate Audio
            </>
          )}
        </button>

        {audioUrl && (
          <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <audio controls className="flex-1 h-10 accent-orange-500" src={audioUrl}>
              Browser Anda tidak mendukung elemen audio.
            </audio>
            <a
              href={audioUrl}
              download={`rr-audio-${Date.now()}.mp3`}
              className="h-12 px-8 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border border-slate-200 dark:border-white/10 cursor-pointer"
            >
              <Download size={16} /> Unduh MP3
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
