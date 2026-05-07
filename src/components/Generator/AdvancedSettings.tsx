import React, { memo, useCallback, useState, useEffect } from 'react';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sparkles, Image as ImageIcon, Plus, X, ChevronDown, Shield, Info } from 'lucide-react';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '../../lib/artStyles';
import BYOPHandler from './BYOPHandler.tsx';
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
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  className?: string;
  onModelSelect: (model: string) => void;
  onByopChange?: () => void;
}

const AdvancedSettings = memo(({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className, onModelSelect, onByopChange }: AdvancedSettingsProps) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [hasByopKey, setHasByopKey] = useState(false);

  useEffect(() => {
    setHasByopKey(!!localStorage.getItem('pollinations_api_key'));
  }, []);

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
        toast.error('Model PRO memerlukan koneksi Pollinations atau Kredit Pro.');
      }
      onModelSelect(modelName);
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  }, [onModelSelect, setSettings, isProModel]);

  const inputStyle = "w-full p-3 bg-white/5 rounded-xl border border-white/10 focus:border-orange-500/50 transition-all text-white font-bold text-sm outline-none";
  const selectStyle = `${inputStyle} appearance-none cursor-pointer`;
  
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <BYOPHandler onKeyChange={onByopChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Aspek Rasio</label>
          <div className="flex gap-2">
            {['Kotak', 'Portrait', 'Lansekap'].map((p) => (
              <button
                key={p}
                onClick={() => onAspectRatioChange(p as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${aspectRatio === p ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Model AI</label>
          <select 
            value={settings.model} 
            onChange={(e) => handleSettingChange('model', e.target.value)}
            className={selectStyle}
          >
            {models.map(m => <option key={m} value={m} className="bg-[#1a1a1a]">{m.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Lebar</label>
          <input type="number" value={settings.width} onChange={(e) => onManualDimensionChange(parseInt(e.target.value), settings.height)} className={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Tinggi</label>
          <input type="number" value={settings.height} onChange={(e) => onManualDimensionChange(settings.width, parseInt(e.target.value))} className={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Batch</label>
          <input type="number" min="1" max="4" value={settings.batchSize} onChange={(e) => handleSettingChange('batchSize', parseInt(e.target.value))} className={inputStyle} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Kualitas</label>
          <select value={settings.imageQuality} onChange={(e) => onImageQualityChange(e.target.value as any)} className={selectStyle}>
            <option value="Standar" className="bg-[#1a1a1a]">Standar</option>
            <option value="HD" className="bg-[#1a1a1a]">HD</option>
            <option value="Ultra" className="bg-[#1a1a1a]">Ultra</option>
          </select>
        </div>
      </div>
    </div>
  );
});

AdvancedSettings.displayName = 'AdvancedSettings';
export default AdvancedSettings;
