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
  isEnhancing: boolean;
  onEnhancePrompt: () => void;
  onCopyJson: () => void;
  models: {id: string; name: string; isPro: boolean; description?: string}[];
}

const ControlPanel = memo(({ settings, setSettings, onGenerate, isLoading, isEnhancing, onEnhancePrompt, onCopyJson, models }: ControlPanelProps) => {
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
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
             <label className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">Prompt Visual</label>
             <div className="flex gap-2">
                <button 
                  onClick={onEnhancePrompt}
                  disabled={isEnhancing || !settings.prompt.trim()}
                  className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-widest rounded-lg border border-orange-500/10 transition-all disabled:opacity-30 cursor-pointer"
                  title="Sempurnakan Prompt"
                >
                  <Sparkles size={10} className={isEnhancing ? 'animate-spin' : ''} />
                  {isEnhancing ? 'Meningkatkan...' : 'Enhance'}
                </button>

                <button 
                  onClick={onCopyJson}
                  className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-black text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Salin JSON"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500/50 group-hover:text-orange-500 transition-colors"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  JSON
                </button>

                <button 
                  onClick={() => setSettings(prev => ({ ...prev, prompt: '' }))}
                  className="px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-400 dark:text-white/40 hover:text-red-500 rounded-lg border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Bersihkan"
                >
                  <X size={12} />
                </button>
             </div>
          </div>
          <textarea
            value={settings.prompt}
            onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Deskripsikan gambar yang ingin Anda buat..."
            className="w-full h-40 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-medium resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner leading-relaxed"
          />
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
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-white/10 disabled:text-slate-400 dark:disabled:text-white/20 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
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
