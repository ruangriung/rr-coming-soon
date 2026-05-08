import React, { memo, useCallback, useState, useEffect } from 'react';
import { ImageIcon, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export interface GeneratorSettings {
  prompt: string;
  negativePrompt: string;
  model: string;
  cfg_scale: number;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
  batchSize: number;
  imageQuality: 'Standar' | 'HD' | 'Ultra';
  private: boolean;
  safe: boolean;
  transparent: boolean;
  nologo: boolean;
  inputImages: string[];
}

interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: {name: string; isPro: boolean; description?: string}[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  className?: string;
  onModelSelect: (model: string) => void;
}

const AdvancedSettings = memo(({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className, onModelSelect }: AdvancedSettingsProps) => {
  
  const isProModel = useCallback((modelName: string) => {
    const normalized = modelName.toLowerCase();
    return normalized.includes('-pro') || 
           ['nanobanana', 'nanobanana-2', 'seedream5', 'grok-imagine', 'nova-canvas', 'p-image', 'veo', 'seedance', 'wan', 'wan-fast', 'p-video'].includes(normalized);
  }, []);

  const handleSettingChange = useCallback((field: keyof GeneratorSettings, value: any) => {
    if (field === 'model') {
      const modelName = value as string;
      const isPro = isProModel(modelName);
      const hasApiKey = !!localStorage.getItem('pollinations_api_key');

      if (isPro && !hasApiKey) {
        toast.error('Model PRO memerlukan akun terhubung.');
      }
      onModelSelect(modelName);
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  }, [onModelSelect, setSettings, isProModel]);

  const inputStyle = "w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-bold text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/20";
  const selectStyle = `${inputStyle} appearance-none cursor-pointer`;
  
  const activeModelInfo = models.find(m => m.name === settings.model);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Aspek Rasio</label>
          <div className="flex gap-2">
            {['Kotak', 'Portrait', 'Lansekap'].map((p) => (
              <button
                key={p}
                onClick={() => onAspectRatioChange(p as any)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${aspectRatio === p ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:border-slate-300 dark:hover:border-white/30'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Pilih Mesin AI</label>
          <div className="relative">
            <select 
              value={settings.model} 
              onChange={(e) => handleSettingChange('model', e.target.value)}
              className={selectStyle}
            >
              {models.map(m => (
                <option key={m.name} value={m.name} className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">
                  {m.name.toUpperCase()} {m.isPro ? '✨ (PRO)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Referensi Gambar (I2I)</label>
          <div className="flex flex-wrap gap-3">
            {settings.inputImages && settings.inputImages.filter(img => img).map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-500/50 group">
                <img src={img} alt="Ref" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const newImages = [...(settings.inputImages || [])];
                    newImages.splice(idx, 1);
                    handleSettingChange('inputImages', newImages);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            
            {(settings.inputImages?.filter(img => img).length || 0) < 1 && (
              <label className="w-20 h-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-dashed border-slate-300 dark:border-white/20 hover:border-orange-500/50 rounded-xl cursor-pointer transition-all gap-1">
                <ImageIcon size={16} className="text-slate-400 dark:text-white/40" />
                <span className="text-[8px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-widest">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        handleSettingChange('inputImages', [base64String]);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Negative Prompt</label>
          <textarea
            value={settings.negativePrompt}
            onChange={(e) => handleSettingChange('negativePrompt', e.target.value)}
            placeholder="Hal-hal yang ingin dihindari (blur, low quality, dll)..."
            className="w-full h-20 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-medium text-xs resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Seed</label>
            <input type="number" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} className={inputStyle} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">CFG</label>
            <input type="number" min="1" max="20" step="0.5" value={settings.cfg_scale} onChange={(e) => handleSettingChange('cfg_scale', parseFloat(e.target.value))} className={inputStyle} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Jumlah</label>
            <input type="number" min="1" max="4" value={settings.batchSize} onChange={(e) => handleSettingChange('batchSize', parseInt(e.target.value))} className={inputStyle} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Kualitas</label>
            <select value={settings.imageQuality} onChange={(e) => onImageQualityChange(e.target.value as any)} className={selectStyle}>
              <option value="Standar" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Standar</option>
              <option value="HD" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">HD</option>
              <option value="Ultra" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Ultra</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Transparent', field: 'transparent' },
          { label: 'No Logo', field: 'nologo' },
          { label: 'Safe Mode', field: 'safe' },
          { label: 'Private', field: 'private' }
        ].map((t) => (
          <button
            key={t.field}
            onClick={() => handleSettingChange(t.field as any, !settings[t.field as keyof GeneratorSettings])}
            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${settings[t.field as keyof GeneratorSettings] ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:border-slate-300 dark:hover:border-white/20'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
});

AdvancedSettings.displayName = 'AdvancedSettings';
export default AdvancedSettings;
