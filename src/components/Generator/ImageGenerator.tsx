import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel.tsx';
import ImageDisplay from './ImageDisplay.tsx';
import ImageModal from './ImageModal.tsx';
import { GeneratorSettings } from './AdvancedSettings.tsx';
import { History, Download, Maximize2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_SETTINGS: GeneratorSettings = {
  prompt: '',
  negativePrompt: '',
  model: 'flux',
  cfg_scale: 7.5,
  width: 1024,
  height: 1024,
  seed: -1,
  artStyle: 'none',
  batchSize: 1,
  imageQuality: 'Standar',
  private: false,
  safe: true,
  transparent: false,
  nologo: true,
  inputImages: [],
};

export default function ImageGenerator({ onPaymentRequired }: { onPaymentRequired?: () => void }) {
  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    const saved = localStorage.getItem('rr_generator_settings');
    if (saved) {
      try {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modelList, setModelList] = useState<{id: string; name: string; isPro: boolean}[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('pollinations_api_key'));

  const handleEnhancePrompt = async () => {
    if (!settings.prompt) return;
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `As an AI image prompt engineer, enhance this short description into a professional, highly detailed image prompt. Focus on artistic style, lighting, composition, and high-quality textures. Keep it concise but powerful. IMPORTANT: Return ONLY the raw prompt text. Do not use any markdown formatting, do not use asterisks, and do not include labels like "Image Prompt:". The original prompt is: "${settings.prompt}"`
        })
      });

      const newPrompt = await response.text();
      if (newPrompt) setSettings(prev => ({ ...prev, prompt: newPrompt.trim() }));
      toast.success('Prompt disempurnakan!');
    } catch (e) {
      toast.error('Gagal menyempurnakan prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyJson = () => {
    const config = {
      ...settings,
      platform: 'RuangRiung AI Studio',
      engine: 'Pollinations.ai',
      timestamp: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    toast.success('Konfigurasi JSON disalin!');
  };

  useEffect(() => {
    const checkAuth = () => {
        setIsLoggedIn(!!localStorage.getItem('pollinations_api_key'));
    };
    window.addEventListener('storage', checkAuth);
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('rr_generator_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rr_generator_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('rr_generator_history', JSON.stringify(history));
    }
  }, [history]);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/pollinations/models/image');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const apiModels = data.map(m => {
            if (typeof m === 'string') return { id: m, name: m, isPro: m.includes('-pro') };
            return { id: m.id || m.name, name: m.name, isPro: m.isPro };
          });
          if (apiModels.length > 0) setModelList(apiModels);
        }
      }
    } catch (err) {
      console.error("Gagal memuat model:", err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleGenerate = async () => {
    if (!settings.prompt.trim()) {
      toast.error('Masukan prompt terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    imageUrls.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    setImageUrls([]);

    try {
      const { batchSize, seed, inputImages, ...rest } = settings;
      const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
      
      const promises = Array(batchSize).fill(0).map(async (_, i) => {
        const body = {
          ...rest,
          prompt: settings.prompt,
          seed: currentSeed + i,
          image: inputImages && inputImages[0] ? inputImages[0] : undefined
        };

        const response = await fetch('/api/pollinations/image', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-pollinations-key': localStorage.getItem('pollinations_api_key') || ''
          },
          body: JSON.stringify(body)
        });

        if (response.status === 402) {
          if (onPaymentRequired) onPaymentRequired();
          throw new Error('Payment Required');
        }
        
        if (!response.ok) throw new Error('Gagal generate gambar');
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      });

      const urls = await Promise.all(promises);
      setImageUrls(urls);
      
      const historyItem = {
        prompt: settings.prompt,
        model: settings.model,
        urls: [urls[0]],
        timestamp: Date.now()
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 20));
      toast.success('Gambar berhasil dibuat!');
    } catch (err: any) {
      if (err.message !== 'Payment Required') {
        toast.error('Terjadi kesalahan saat membuat gambar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700">
      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 max-w-7xl mx-auto">
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-6">
           <ImageDisplay isLoading={isLoading} imageUrls={imageUrls} />
           {imageUrls.length > 0 && (
             <button 
               onClick={() => setSelectedImage(imageUrls[0])}
               className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest hover:text-orange-500 transition-all cursor-pointer"
             >
               <Maximize2 size={14} /> Perbesar Hasil
             </button>
           )}
        </div>
        <div className="w-full lg:w-1/2">
            <ControlPanel 
              settings={settings} 
              setSettings={setSettings} 
              onGenerate={handleGenerate} 
              isLoading={isLoading}
              isEnhancing={isEnhancing}
              onEnhancePrompt={handleEnhancePrompt}
              onCopyJson={handleCopyJson}
              models={modelList}
            />
        </div>
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-7xl mx-auto space-y-8 mt-12 pt-12 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="text-orange-500" size={24} />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Riwayat Studio</h3>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={fetchModels}
                className="text-[10px] font-black text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={12} /> Segarkan Model
              </button>
              <button 
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('rr_generator_history');
                }}
                className="text-[10px] font-black text-slate-400 dark:text-white/20 hover:text-red-500 uppercase tracking-widest transition-all cursor-pointer"
              >
                Hapus Riwayat
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((item, idx) => (
              <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-orange-500/50 transition-all cursor-pointer shadow-lg shadow-slate-200/50 dark:shadow-none">
                <img src={item.urls[0]} alt={item.prompt} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 gap-3">
                  <p className="text-[10px] text-white/80 font-medium line-clamp-2 leading-relaxed">{item.prompt}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSettings(prev => ({ ...prev, prompt: item.prompt, model: item.model }));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Reuse
                    </button>
                    <button 
                      onClick={() => setSelectedImage(item.urls[0])}
                      className="p-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white transition-all cursor-pointer"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <ImageModal 
          isOpen={!!selectedImage} 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
}
