import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { ImageIcon, X, Info, Crown, ChevronDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import ConnectProModal from './ConnectProModal.tsx';

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
  imageQuality: 'low' | 'medium' | 'high' | 'hd';
  private: boolean;
  safe: boolean;
  transparent: boolean;
  nologo: boolean;
  enhance: boolean;
  inputImages: string[];
}

interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: {id: string; name: string; isPro: boolean; description?: string}[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'low' | 'medium' | 'high' | 'hd') => void;
  className?: string;
  onModelSelect: (model: string) => void;
  onRefreshModels: () => void;
  isRefreshingModels: boolean;
}

const AdvancedSettings = memo(({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className, onModelSelect, onRefreshModels, isRefreshingModels }: AdvancedSettingsProps) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedProModel, setSelectedProModel] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const isProModel = useCallback((modelName: string) => {
    const normalized = modelName.toLowerCase();
    return normalized.includes('-pro') || 
           ['nanobanana', 'nanobanana-2', 'seedream5', 'grok-imagine', 'nova-canvas', 'p-image', 'veo', 'seedance', 'wan', 'wan-fast', 'p-video', 'gpt-image-2'].includes(normalized);
  }, []);

  const handleConfirmConnect = useCallback(() => {
    const params = new URLSearchParams({
      redirect_uri: window.location.origin + window.location.pathname,
      client_id: 'pk_hprMp1nmhXOvJE7H', 
      scope: 'usage keys',
      expiry: '30',
      budget: '10'
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  }, []);

  const handleSettingChange = useCallback((field: keyof GeneratorSettings, value: any) => {
    if (field === 'model') {
      const modelName = value as string;
      const modelObj = models.find(m => m.id === modelName);
      const isPro = modelObj?.isPro || isProModel(modelName);
      const hasApiKey = !!localStorage.getItem('pollinations_api_key');

      if (isPro && !hasApiKey) {
        setSelectedProModel(modelObj?.name || modelName);
        setIsConnectModalOpen(true);
        return;
      }
      onModelSelect(modelName);
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  }, [onModelSelect, setSettings, isProModel, models]);

  const inputStyle = "w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-bold text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/20";
  const selectStyle = `${inputStyle} appearance-none cursor-pointer`;
  
  const activeModelInfo = models.find(m => m.id === settings.model);
  const normalizedModel = settings.model.toLowerCase();
  
  const supportedI2IModels = ['flux', 'zimage', 'seedream', 'klein', 'nanobanana'];
  const isI2ISupported = supportedI2IModels.includes(normalizedModel);

  const supportedNegativePrompt = ['flux', 'zimage'];
  const isNegativePromptSupported = supportedNegativePrompt.includes(normalizedModel);

  const supportedSeed = ['flux', 'zimage', 'seedream', 'klein', 'seedream2', 'nova-real'];
  const isSeedSupported = supportedSeed.includes(normalizedModel);

  const supportedQuality = ['gptimage', 'gptimage-large', 'gpt-image-2'];
  const isQualitySupported = supportedQuality.includes(normalizedModel);

  const supportedTransparent = ['gptimage', 'gptimage-large', 'gpt-image-2'];
  const isTransparentSupported = supportedTransparent.includes(normalizedModel);

  return (
    <>
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

        <div ref={dropdownRef}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Pilih Mesin AI</label>
            <button 
              type="button"
              onClick={onRefreshModels}
              disabled={isRefreshingModels}
              className="text-[9px] font-black text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Segarkan daftar model"
            >
              <RefreshCw size={10} className={isRefreshingModels ? 'animate-spin text-orange-500' : ''} /> Segarkan
            </button>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-bold text-sm outline-none flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {activeModelInfo ? activeModelInfo.name.toUpperCase() : settings.model.toUpperCase()}
                {((activeModelInfo && activeModelInfo.isPro) || isProModel(settings.model)) && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase tracking-wider border border-orange-500/20">
                    <Crown size={10} className="fill-orange-500/20 text-orange-500" />
                    PRO
                  </span>
                )}
              </span>
              <ChevronDown size={16} className={`text-slate-400 dark:text-white/40 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute z-[150] w-full mt-2 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-1.5 space-y-1"
                >
                  {models.map(m => {
                    const isPro = m.isPro || isProModel(m.id);
                    const isSelected = settings.model === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          handleSettingChange('model', m.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-orange-500 text-white' 
                            : 'text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{m.name.toUpperCase()}</span>
                        {isPro && (
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                            isSelected 
                              ? 'bg-white/20 text-white border-white/25' 
                              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                          }`}>
                            <Crown size={10} className={isSelected ? "fill-white/20 text-white" : "fill-orange-500/20 text-orange-500"} />
                            PRO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Referensi Gambar (I2I)</label>
          {isI2ISupported ? (
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
              
              {(settings.inputImages?.filter(img => img).length || 0) < 3 && (
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
                          handleSettingChange('inputImages', [...(settings.inputImages || []), base64String]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="w-full p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-2.5">
              <Info size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-orange-500/80 font-medium leading-relaxed">
                Fitur referensi gambar (I2I) tidak didukung oleh model <strong className="text-orange-500 uppercase">{activeModelInfo?.name || settings.model}</strong>. Silakan pilih model lain.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2">Negative Prompt</label>
          {isNegativePromptSupported ? (
            <textarea
              value={settings.negativePrompt}
              onChange={(e) => handleSettingChange('negativePrompt', e.target.value)}
              placeholder="Hal-hal yang ingin dihindari (blur, low quality, dll)..."
              className="w-full h-20 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-medium text-xs resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner"
            />
          ) : (
            <div className="w-full p-3 bg-slate-100 dark:bg-white/5 border border-transparent rounded-xl flex items-start gap-2.5 opacity-50 cursor-not-allowed">
              <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Negative Prompt tidak didukung oleh model <strong className="uppercase">{activeModelInfo?.name || settings.model}</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Seed</label>
            <input type="number" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} disabled={!isSeedSupported} className={`${inputStyle} ${!isSeedSupported ? 'opacity-50 cursor-not-allowed' : ''}`} title={!isSeedSupported ? "Tidak didukung oleh model ini" : ""} />
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
            <select value={settings.imageQuality} onChange={(e) => onImageQualityChange(e.target.value as any)} disabled={!isQualitySupported} className={`${selectStyle} ${!isQualitySupported ? 'opacity-50 cursor-not-allowed' : ''}`} title={!isQualitySupported ? "Tidak didukung oleh model ini" : ""}>
              <option value="low" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Low</option>
              <option value="medium" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Medium</option>
              <option value="high" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">High</option>
              <option value="hd" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">HD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Auto-Enhance', field: 'enhance', supported: true },
          { label: 'Transparent', field: 'transparent', supported: isTransparentSupported },
          { label: 'No Logo', field: 'nologo', supported: true },
          { label: 'Safe Mode', field: 'safe', supported: true },
          { label: 'Private', field: 'private', supported: true }
        ].map((t) => (
          <button
            key={t.field}
            onClick={() => t.supported && handleSettingChange(t.field as any, !settings[t.field as keyof GeneratorSettings])}
            disabled={!t.supported}
            title={!t.supported ? "Tidak didukung oleh model ini" : ""}
            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
               !t.supported 
               ? 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-300 dark:text-white/10 cursor-not-allowed opacity-50' 
               : settings[t.field as keyof GeneratorSettings] 
                 ? 'bg-orange-500 border-orange-500 text-white cursor-pointer shadow-lg shadow-orange-500/20' 
                 : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer'
             }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
    <ConnectProModal 
      isOpen={isConnectModalOpen}
      onClose={() => {
        setIsConnectModalOpen(false);
        setSelectedProModel(null);
      }}
      onConfirm={handleConfirmConnect}
      modelName={selectedProModel || undefined}
    />
  </>
);
});

AdvancedSettings.displayName = 'AdvancedSettings';
export default AdvancedSettings;
