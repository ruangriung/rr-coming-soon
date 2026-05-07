import React, { useState, useCallback, memo } from 'react';
import { Wand2, RefreshCw, X, Sparkles, AlertCircle } from 'lucide-react';
import AdvancedSettings, { GeneratorSettings } from './AdvancedSettings.tsx';
import ButtonSpinner from './ButtonSpinner.tsx';
import toast from 'react-hot-toast';

interface ControlPanelProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
  models: {name: string; isPro: boolean}[];
}

const ControlPanel = memo(({ settings, setSettings, onGenerate, isLoading, models }: ControlPanelProps) => {
  const [aspectRatio, setAspectRatio] = useState<'Kotak' | 'Portrait' | 'Lansekap' | 'Custom'>('Kotak');

  const handleAspectRatioChange = useCallback((preset: 'Kotak' | 'Portrait' | 'Lansekap') => {
    setAspectRatio(preset);
    if (preset === 'Kotak') setSettings(prev => ({ ...prev, width: 1024, height: 1024 }));
    else if (preset === 'Portrait') setSettings(prev => ({ ...prev, width: 768, height: 1344 }));
    else if (preset === 'Lansekap') setSettings(prev => ({ ...prev, width: 1344, height: 768 }));
  }, [setSettings]);

  const handleManualDimensionChange = useCallback((width: number, height: number) => {
    setSettings(prev => ({ ...prev, width, height }));
    setAspectRatio('Custom');
  }, [setSettings]);

  const handleImageQualityChange = useCallback((quality: 'Standar' | 'HD' | 'Ultra') => {
    setSettings(prev => ({ ...prev, imageQuality: quality }));
  }, [setSettings]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="relative">
          <textarea
            value={settings.prompt}
            onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Deskripsikan gambar yang ingin Anda buat..."
            className="w-full h-32 p-4 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-orange-500/50 transition-all text-white font-medium resize-none outline-none"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={() => setSettings(prev => ({ ...prev, prompt: '' }))}
              className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <AdvancedSettings
          settings={settings}
          setSettings={setSettings}
          models={models}
          aspectRatio={aspectRatio}
          onAspectRatioChange={handleAspectRatioChange}
          onManualDimensionChange={handleManualDimensionChange}
          onImageQualityChange={handleImageQualityChange}
          onModelSelect={(model) => setSettings(prev => ({ ...prev, model }))}
        />

        <button
          onClick={onGenerate}
          disabled={isLoading || !settings.prompt.trim()}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/20 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? <ButtonSpinner /> : <Sparkles size={20} />}
          {isLoading ? 'Sedang Memproses...' : 'Generate Visual'}
        </button>
      </div>
    </div>
  );
});

ControlPanel.displayName = 'ControlPanel';
export default ControlPanel;
