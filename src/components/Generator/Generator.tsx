import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './ControlPanel.tsx';
import ImageDisplay from './ImageDisplay.tsx';
import { GeneratorSettings } from './AdvancedSettings.tsx';
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
  const [settings, setSettings] = useState<GeneratorSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [modelList, setModelList] = useState<string[]>([]);

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
              .map(m => typeof m === 'string' ? m : (m.name || m.model || ''))
              .filter(name => name.length > 0);

            if (apiModels.length > 0) {
              setModelList(apiModels);
              // Set initial model if current one isn't in the list
              if (!apiModels.includes(settings.model)) {
                setSettings(prev => ({ 
                  ...prev, 
                  model: apiModels.includes('flux') ? 'flux' : apiModels[0] 
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

  const handleGenerate = useCallback(async () => {
    if (!settings.prompt.trim()) {
      toast.error("Prompt tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setImageUrls([]);

    try {
      const response = await fetch('/api/pollinations/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          seed: settings.seed === -1 ? Math.floor(Math.random() * 1000000) : settings.seed,
          apiKey: localStorage.getItem('pollinations_api_key')
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal generate gambar');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrls([url]);
      toast.success("Gambar berhasil dibuat!");
    } catch (error: any) {
      console.error("Generator Error:", error);
      toast.error(error.message || "Terjadi kesalahan saat generate");
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

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
    </div>
  );
}
