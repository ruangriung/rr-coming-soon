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
  models: {name: string; isPro: boolean}[];
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
            {models.map(m => (
              <option key={m.name} value={m.name} className="bg-[#1a1a1a]">
                {m.name.toUpperCase()} {m.isPro ? '✨ (PRO)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Gambar Referensi (Image-to-Image)</label>
          <div className="flex flex-wrap gap-3">
            {settings.inputImages && settings.inputImages.filter(img => img).map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-500/50">
                <img src={img} alt="Ref" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    const newImages = [...(settings.inputImages || [])];
                    newImages.splice(idx, 1);
                    handleSettingChange('inputImages', newImages);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 rounded-lg text-white transition-all"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            
            {(settings.inputImages?.filter(img => img).length || 0) < 1 && (
              <label className="w-20 h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-orange-500/50 rounded-xl cursor-pointer transition-all gap-1">
                <ImageIcon size={16} className="text-white/40" />
                <span className="text-[8px] font-bold text-white/20 uppercase">Upload</span>
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
          <p className="text-[8px] text-white/20 mt-2 font-medium">AI akan menggunakan gambar ini sebagai referensi bentuk dan warna.</p>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Negative Prompt (Yang dihindari)</label>
          <textarea
            value={settings.negativePrompt}
            onChange={(e) => handleSettingChange('negativePrompt', e.target.value)}
            placeholder="Contoh: blur, low quality, bad anatomy..."
            className="w-full h-20 p-3 bg-white/5 rounded-xl border border-white/10 focus:border-orange-500/50 transition-all text-white font-medium text-xs resize-none outline-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Seed (-1 = Acak)</label>
            <input type="number" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} className={inputStyle} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">CFG Scale (1-20)</label>
            <input type="number" min="1" max="20" step="0.5" value={settings.cfg_scale} onChange={(e) => handleSettingChange('cfg_scale', parseFloat(e.target.value))} className={inputStyle} />
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
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${settings[t.field as keyof GeneratorSettings] ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
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
