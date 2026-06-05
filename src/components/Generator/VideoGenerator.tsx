import React, { useState, useEffect, useRef } from 'react';
import { Video, Sparkles, Download, Wand2, Plus, AlertCircle, RefreshCw, X, Lock, Key, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import GeneratorNotice from './GeneratorNotice.tsx';
import toast from 'react-hot-toast';

export default function VideoGenerator({ onPaymentRequired }: { onPaymentRequired?: () => void }) {
    const [prompt, setPrompt] = useState('');
    const [seed, setSeed] = useState('-1');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [model, setModel] = useState('veo');
    const [audio, setAudio] = useState(false);
    const [duration, setDuration] = useState<number | ''>('');
    const [models, setModels] = useState<{id: string; name: string; isPro: boolean; description?: string; cost?: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('pollinations_api_key'));
    const displayRef = useRef<HTMLDivElement>(null);

    const handleConnectBYOP = () => {
        const params = new URLSearchParams({
            redirect_uri: window.location.origin + window.location.pathname + '?tab=video',
            client_id: 'pk_hprMp1nmhXOvJE7H', 
        });
        window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
    };

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('pollinations_api_key'));
        };
        window.addEventListener('storage', checkAuth);
        // Also check periodically or on mount
        checkAuth();
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const fetchModels = async () => {
        try {
            let response = await fetch('/api/pollinations/models/video', {
                headers: {
                    'x-pollinations-key': localStorage.getItem('pollinations_api_key') || ''
                }
            });

            // Fallback to direct API if proxy fails (500 or 404)
            if (!response.ok) {
                console.warn("Proxy API failed, falling back to direct Pollinations API");
                const activeKey = localStorage.getItem('pollinations_api_key');
                response = await fetch('https://gen.pollinations.ai/models', {
                    headers: activeKey ? {
                        'Authorization': `Bearer ${activeKey}`
                    } : {}
                });
            }

            if (response.ok) {
                const data = await response.json();
                let videoModels = [];
                
                if (Array.isArray(data)) {
                    // Direct API or Array response from proxy
                    videoModels = data.filter((m: any) => {
                        if (!m.output_modalities) return true; // Data dari proxy sudah di-filter
                        const modalities = m.output_modalities || [];
                        const id = (m.id || '').toLowerCase();
                        return modalities.includes('video') || id.includes('video') || id.includes('veo') || id.includes('wan');
                    }).map((m: any) => ({
                        id: m.id || m.name,
                        name: m.name || (m.id ? m.id.charAt(0).toUpperCase() + m.id.slice(1) : 'Unknown'),
                        isPro: m.isPro || m.paid_only || false,
                        description: m.description,
                        cost: m.cost || (m.pricing?.completionVideoSeconds ? `${m.pricing.completionVideoSeconds} pollen/sec` : undefined)
                    }));
                }

                if (videoModels.length > 0) {
                    setModels(videoModels);
                    if (!videoModels.find((m: any) => m.id === model)) {
                        const hasVeo = videoModels.find((m: any) => m.id === 'veo');
                        setModel(hasVeo ? 'veo' : videoModels[0].id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch video models:", error);
        }
    };

    useEffect(() => {
        fetchModels();
    }, [isLoggedIn]);

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/pollinations/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `As an AI video prompt engineer, enhance this short description into a professional, cinematic video prompt. Focus on lighting, camera movement, textures, and atmosphere. Keep it under 200 words but make it highly descriptive. IMPORTANT: Return ONLY the raw prompt text. Do not use any markdown formatting, do not use asterisks, and do not include labels like "Video Prompt:". The original prompt is: "${prompt}"`
                })
            });

            if (response.status === 402) {
                if (onPaymentRequired) onPaymentRequired();
                return;
            }

            const newPrompt = await response.text();
            if (newPrompt) setPrompt(newPrompt.trim());
            toast.success('Prompt disempurnakan!');
        } catch (e) {
            toast.error('Gagal menyempurnakan prompt');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleCopyJson = () => {
        const config = {
            model,
            prompt,
            seed: seed === '-1' ? 'random' : parseInt(seed),
            aspect_ratio: aspectRatio,
            width: aspectRatio === '16:9' ? 1280 : 720,
            height: aspectRatio === '16:9' ? 720 : 1280,
            audio: audio,
            ...(duration !== '' ? { duration } : {}),
            platform: 'RuangRiung AI Studio',
            engine: 'Pollinations.ai'
        };
        
        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
        toast.success('Konfigurasi JSON disalin!');
    };

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Masukkan prompt terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);
        
        if (displayRef.current) {
            displayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        try {
            const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
            const width = wRatio > hRatio ? 1280 : 720;
            const height = Math.round(width * (hRatio / wRatio));

            let response = await fetch('/api/pollinations/video', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-pollinations-key': localStorage.getItem('pollinations_api_key') || ''
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    seed: seed === '-1' ? Math.floor(Math.random() * 1000000) : parseInt(seed),
                    width,
                    height,
                    audio: audio,
                    ...(duration !== '' ? { duration } : {})
                })
            });

            // Fallback to direct API if proxy fails
            if (!response.ok) {
                console.warn("Proxy generation failed, falling back to direct Pollinations API");
                const activeKey = localStorage.getItem('pollinations_api_key');
                const pollParams = new URLSearchParams({
                    model,
                    seed: (seed === '-1' ? Math.floor(Math.random() * 1000000) : parseInt(seed)).toString(),
                    width: width.toString(),
                    height: height.toString()
                });
                if (audio) pollParams.set('audio', 'true');
                if (duration !== '') pollParams.set('duration', duration.toString());
                if (activeKey) pollParams.set('key', activeKey);
                
                const directUrl = `https://gen.pollinations.ai/video/${encodeURIComponent(prompt)}?${pollParams.toString()}`;
                response = await fetch(directUrl, {
                    headers: {
                        'Accept': 'video/*',
                        ...(activeKey ? { 'Authorization': `Bearer ${activeKey}` } : {})
                    }
                });
            }

            if (response.status === 402) {
                if (onPaymentRequired) onPaymentRequired();
                return;
            }

            if (!response.ok) throw new Error('Gagal membuat video');

            const blob = await response.blob();
            
            // Save to IndexedDB history
            import('../../lib/history').then(({ saveToHistory }) => {
              saveToHistory({
                type: 'video',
                blob: blob,
                prompt: prompt
              }).catch(err => console.error('Failed to save video to history', err));
            });

            setVideoUrl(URL.createObjectURL(blob));
            toast.success('Video berhasil dibuat!');
        } catch (error: any) {
            toast.error('Gagal membuat video.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
                <div className="p-8 md:p-12 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col items-center text-center gap-6 max-w-2xl mx-auto transform-gpu">
                    {/* Glowing background highlights */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-[80px] pointer-events-none transform-gpu" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-[80px] pointer-events-none transform-gpu" />

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-sm animate-pulse">
                        <Sparkles size={12} className="text-orange-500" />
                        <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest italic">PRO FEATURE</span>
                    </div>

                    {/* Animated Pulsing Icon */}
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner group">
                        <div className="absolute inset-0 rounded-full bg-orange-500/10 dark:bg-orange-500/20 animate-ping duration-1000 scale-90" />
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                            <Video size={28} strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-orange-500 border border-slate-800 shadow-md">
                            <Lock size={14} />
                        </div>
                    </div>

                    {/* Content text */}
                    <div className="space-y-3 max-w-md">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                            Aktifkan AI Video Creator
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider leading-relaxed">
                            Hubungkan akun BYOP (Bring Your Own Pollen) Anda untuk mengubah deskripsi teks menjadi runtutan video sinematik yang menakjubkan.
                        </p>
                    </div>

                    {/* Key Benefits */}
                    <div className="w-full max-w-md grid grid-cols-1 gap-3 py-4 border-y border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.02]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Sparkles size={14} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-1">Model Video Kelas Dunia</h4>
                                <p className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">Veo 3.1 Pro, LTX Video, Wan-2.1</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.02]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Zap size={14} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-1">Super Fast Rendering</h4>
                                <p className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">Rendering cepat tanpa batas antrean gratis</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.02]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <ShieldCheck size={14} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-1">Bebas Watermark & Komersial</h4>
                                <p className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tight">Hasil video bersih siap digunakan secara profesional</p>
                            </div>
                        </div>
                    </div>

                    {/* Glowing CTA Button */}
                    <button
                        onClick={handleConnectBYOP}
                        className="group flex items-center gap-3 px-8 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 cursor-pointer w-full max-w-md justify-center"
                    >
                        <Key size={18} />
                        Hubungkan Akun PRO (BYOP)
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-[9px] text-slate-400 dark:text-white/30 italic font-medium">
                        Memerlukan kunci Pollinations.ai dengan saldo Pollen aktif.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <GeneratorNotice />
            <div className="w-full flex flex-col-reverse lg:flex-row items-start justify-between gap-8 lg:gap-12">
                <div className="w-full lg:w-[45%] flex-shrink-0 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Pilih Mesin Video</label>
                            <button onClick={fetchModels} className="text-slate-400 dark:text-white/20 hover:text-orange-500 dark:hover:text-white transition-all"><RefreshCw size={12} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {models.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setModel(m.id)}
                                    title={m.description}
                                    className={`px-4 py-3 rounded-xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
                                        model === m.id 
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                        : `bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-orange-500/50 ${isLoggedIn ? 'text-slate-900 dark:text-white/90' : 'text-slate-400 dark:text-white/30'}`
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5 relative z-10">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                                                    model === m.id ? 'text-white' : (isLoggedIn ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/40')
                                                }`}>
                                                    {m.name}
                                                </span>
                                                {m.isPro && (
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md transition-all ${
                                                        model === m.id 
                                                        ? 'bg-white/20 text-white' 
                                                        : (isLoggedIn ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/50' : 'bg-white/10 text-white/20')
                                                    }`}>PRO</span>
                                                )}
                                            </div>
                                            {m.cost && (
                                                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/20 ${
                                                    model === m.id ? 'text-white/60' : (isLoggedIn ? 'text-slate-500 dark:text-white/50' : 'text-slate-300 dark:text-white/10')
                                                }`}>
                                                    {m.cost}
                                                </span>
                                            )}
                                        </div>
                                        {m.description && (
                                            <span className={`text-[7px] font-medium leading-none truncate w-full transition-colors ${
                                                model === m.id ? 'text-white/60' : (isLoggedIn ? 'text-slate-400 dark:text-white/40' : 'text-slate-300 dark:text-white/10')
                                            }`}>
                                                {m.description}
                                            </span>
                                        )}
                                    </div>
                                    {/* Subtle login-based glow effect */}
                                    {isLoggedIn && model !== m.id && (
                                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-all duration-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="block text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">Prompt Video</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleEnhancePrompt}
                                    disabled={isEnhancing || !prompt}
                                    className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-widest rounded-lg border border-orange-500/10 transition-all disabled:opacity-30 cursor-pointer"
                                    title="Sempurnakan Prompt"
                                >
                                    <Sparkles size={10} className={isEnhancing ? 'animate-spin' : ''} />
                                    {isEnhancing ? 'Meningkatkan...' : 'Enhance'}
                                </button>

                                <button 
                                    onClick={handleCopyJson}
                                    className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[9px] font-black text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/10 group cursor-pointer"
                                    title="Salin JSON"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500/50 group-hover:text-orange-500 transition-colors"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    JSON
                                </button>

                                <button 
                                    onClick={() => setPrompt('')}
                                    className="px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 text-slate-400 dark:text-white/40 hover:text-red-500 rounded-lg border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                                    title="Bersihkan"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Deskripsikan video Anda..."
                            className="w-full h-36 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-orange-500/50 transition-all text-slate-900 dark:text-white font-medium outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-inner leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Aspek Rasio</label>
                            <select 
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                            >
                                <option value="16:9" className="bg-white dark:bg-black text-slate-900 dark:text-white">16:9 Landscape</option>
                                <option value="9:16" className="bg-white dark:bg-black text-slate-900 dark:text-white">9:16 Portrait</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Durasi (s)</label>
                            <input 
                                type="number" 
                                value={duration}
                                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                                placeholder="Auto"
                                min={1}
                                max={120}
                                className="w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black outline-none placeholder:text-slate-400/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Audio</label>
                            <button
                                onClick={() => setAudio(!audio)}
                                className={`w-full p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                    audio 
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 hover:border-slate-300 dark:hover:border-white/20'
                                }`}
                            >
                                {audio ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Seed</label>
                            <input 
                                type="number" 
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                disabled={!['nova-real'].includes(model.toLowerCase())}
                                title={!['nova-real'].includes(model.toLowerCase()) ? "Hanya didukung oleh model nova-real" : ""}
                                className={`w-full p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black outline-none ${!['nova-real'].includes(model.toLowerCase()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full h-16 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20 cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <ButtonSpinner />
                                <span>Generating...</span>
                            </div>
                        ) : (
                            <>
                                <Video size={20} /> Generate Video
                            </>
                        )}
                    </button>
                </div>

                <div ref={displayRef} className="w-full lg:w-[55%] flex flex-col items-center justify-center space-y-6 lg:sticky lg:top-24 pt-4 lg:pt-0">
                    <div className="w-full aspect-video rounded-3xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden relative group shadow-xl shadow-slate-200/50 dark:shadow-none">
                        {videoUrl ? (
                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/10">
                                    <Video size={32} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Preview Video</p>
                            </div>
                        )}
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Memproses Mahakarya...</p>
                            </div>
                        )}
                    </div>

                    {videoUrl && (
                        <a 
                            href={videoUrl} 
                            download={`rr-video-${Date.now()}.mp4`}
                            className="w-full h-12 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-white/10 shadow-lg"
                        >
                            <Download size={16} /> Download Video
                        </a>
                    )}

                    <div className="w-full p-4 bg-orange-500/10 rounded-2xl flex items-start gap-3 border border-orange-500/20">
                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-orange-200/60 font-medium leading-relaxed uppercase tracking-tighter">
                            Gunakan Akun PRO untuk akses model video terbaik tanpa batas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import ButtonSpinner from './ButtonSpinner.tsx';
