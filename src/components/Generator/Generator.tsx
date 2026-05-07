import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './ControlPanel.tsx';
import ImageDisplay from './ImageDisplay.tsx';
import { GeneratorSettings } from './AdvancedSettings.tsx';
import { Wand2, Sparkles, History, Download } from 'lucide-react';
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

const DEFAULT_PROMPTS = [
  'A majestic dragon in a fantasy forest, cinematic lighting, digital painting',
  'Cyberpunk city at night, neon reflections on wet streets, rain, photorealistic, 8k',
  'A cute robot exploring Mars, Pixar style, vibrant colors, clear skies',
  'Underwater alien landscape, bioluminescent plants, glowing fish, surreal, deep sea photography'
];

const extractModelNames = (rawData: unknown): string[] => {
  if (!Array.isArray(rawData)) return [];
  return rawData
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if ('name' in item && typeof (item as { name?: unknown }).name === 'string') return (item as { name: string }).name;
        if ('model' in item && typeof (item as { model?: unknown }).model === 'string') return (item as { model: string }).model;
      }
      return '';
    })
    .filter((name): name is string => typeof name === 'string' && name.trim().length > 0);
};


export default function Generator() {
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modelList, setModelList] = useState<{name: string; isPro: boolean}[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('rr_generator_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
  }, []);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('rr_generator_settings', JSON.stringify(settings));
  }, [settings]);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('rr_generator_history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const headers: Record<string, string> = { 'Accept': 'application/json' };
        const storedKey = localStorage.getItem('pollinations_api_key');
        if (storedKey) headers['Authorization'] = `Bearer ${storedKey}`;

        const response = await fetch('/api/pollinations/models/image', { headers });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const apiModels = data
              .filter(m => {
                const name = (typeof m === 'string' ? m : (m.name || m.model || '')).toLowerCase();
                return !name.includes('video') && !name.includes('mp4');
              })
              .map(m => {
                const name = typeof m === 'string' ? m : (m.name || m.model || '');
                // Detect PRO status from API metadata or name suffix
                const isPro = m.paid_only === true || name.toLowerCase().includes('-pro');
                return { name, isPro };
              })
              .filter(m => m.name.length > 0);

            if (apiModels.length > 0) {
              setModelList(apiModels);
              // Set initial model if current one isn't in the list
              const modelNames = apiModels.map(m => m.name);
              if (!modelNames.includes(settings.model)) {
                setSettings(prev => ({ 
                  ...prev, 
                  model: modelNames.includes('flux') ? 'flux' : modelNames[0] 
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat model dinamis:", err);
      }
    };
    fetchModels();
  }, []);

  const handleGenerate = async () => {
    if (!settings.prompt.trim()) {
      toast.error('Masukan prompt terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    // Cleanup old blob URLs to prevent memory leaks
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
          // Map first input image to 'image' parameter for I2I
          image: inputImages && inputImages[0] ? inputImages[0] : undefined
        };

        const response = await fetch('/api/pollinations/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Gagal generate gambar');
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      });

      const urls = await Promise.all(promises);
      setImageUrls(urls);
      
      // Add to history (using first URL for preview)
      const historyItem = {
        prompt: settings.prompt,
        model: settings.model,
        urls: [urls[0]],
        timestamp: Date.now()
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 20));

      toast.success('Gambar berhasil dibuat!');
    } catch (err) {
      console.error("Generate Error:", err);
      toast.error('Terjadi kesalahan saat membuat gambar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 py-12 px-4">
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          AI <span className="text-orange-500">Visual</span> Studio
        </h2>
        <p className="text-white/40 font-medium">
          Ubah imajinasi Anda menjadi visual berkualitas tinggi secara instan dengan teknologi model AI terbaru.
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 max-w-7xl">
        <div className="w-full lg:w-1/2 flex justify-center">
           <ImageDisplay isLoading={isLoading} imageUrls={imageUrls} />
        </div>
        <div className="w-full lg:w-1/2">
           <ControlPanel 
             settings={settings} 
             setSettings={setSettings} 
             onGenerate={handleGenerate} 
             isLoading={isLoading}
             models={modelList}
           />
        </div>
      </div>

      {/* History Gallery */}
      {history.length > 0 && (
        <div className="w-full max-w-7xl space-y-8 mt-12 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="text-orange-500" size={24} />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Riwayat Studio</h3>
            </div>
            <button 
              onClick={() => {
                setHistory([]);
                localStorage.removeItem('rr_generator_history');
              }}
              className="text-[10px] font-black text-white/20 hover:text-red-500 uppercase tracking-widest transition-all"
            >
              Hapus Riwayat
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((item, idx) => (
              <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer">
                <img 
                  src={item.urls[0]} 
                  alt={item.prompt} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 gap-3">
                  <p className="text-[10px] text-white/80 font-medium line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSettings(prev => ({ ...prev, prompt: item.prompt, model: item.model }));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-wider transition-all"
                    >
                      Gunakan Lagi
                    </button>
                    <a 
                      href={item.urls[0]} 
                      download={`rr-ai-${Date.now()}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white transition-all"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
