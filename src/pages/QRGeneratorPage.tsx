import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
import { ArrowLeft, Download, Upload, Trash2, QrCode, Palette, Type, RotateCcw } from 'lucide-react';
import ThemeToggle from '../components/UI/ThemeToggle';

export default function QRGeneratorPage() {
  const [text, setText] = useState('https://ruangriung.my.id');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState<string | null>('/logo.webp');
  const [logoSize, setLogoSize] = useState<number>(40);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [qrStyle, setQrStyle] = useState<'squares' | 'dots'>('squares');
  const [eyeStyle, setEyeStyle] = useState<'square' | 'rounded' | 'circle'>('square');
  
  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        // Force high error correction when adding logo
        setErrorLevel('H');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
  };

  const resetDesign = () => {
    setFgColor('#000000');
    setBgColor('#ffffff');
    setQrStyle('squares');
    setEyeStyle('square');
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    // Save to IndexedDB history
    canvas.toBlob((blob) => {
      if (blob) {
        import('../lib/history').then(({ saveToHistory }) => {
          saveToHistory({
            type: 'qr',
            blob: blob,
            prompt: text
          }).catch(err => console.error('Failed to save QR to history', err));
        });
      }
    });

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `rr-qrcode-${Date.now()}.png`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-24 pt-12 px-4 transition-colors duration-500 font-sans selection:bg-orange-500/20">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium tracking-wide text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-left mb-16 relative">
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-white/50 mb-4">
            <QrCode size={16} strokeWidth={1.5} />
            <span className="text-[10px] font-medium uppercase tracking-widest">Alat Produksi Digital</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-6">
            QR Code <span className="text-slate-400 dark:text-[#666]">Generator.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-white/40 font-light max-w-2xl leading-relaxed">
            Buat kode QR kustom profesional dengan dukungan logo, penyesuaian warna, dan koreksi kesalahan tinggi untuk materi pemasaran Anda.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Data Input */}
            <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60">
                  <Type size={16} />
                </div>
                <h3 className="text-lg font-medium">Konten QR</h3>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Masukkan URL, teks, atau data lainnya..."
                className="w-full h-32 p-4 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white font-medium focus:border-slate-400 dark:focus:border-white/30 outline-none transition-all resize-none"
              />
            </div>

            {/* Styling Input */}
            <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60">
                    <Palette size={16} />
                  </div>
                  <h3 className="text-lg font-medium">Desain & Warna</h3>
                </div>
                <button 
                  onClick={resetDesign}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 font-medium transition-colors bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg"
                >
                  <RotateCcw size={12} /> Reset Desain
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50">Warna QR (Foreground)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-xl text-sm font-mono focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50">Warna Latar (Background)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-xl text-sm font-mono focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <label className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50">Gaya Barcode (Pattern)</label>
                  <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setQrStyle('squares')}
                      className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        qrStyle === 'squares' 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                    >
                      Kotak (Squares)
                    </button>
                    <button
                      onClick={() => setQrStyle('dots')}
                      className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        qrStyle === 'dots' 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                    >
                      Titik (Dots)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50">Gaya Sudut Mata (Eye Radius)</label>
                  <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button
                      onClick={() => setEyeStyle('square')}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        eyeStyle === 'square' 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                    >
                      Kaku
                    </button>
                    <button
                      onClick={() => setEyeStyle('rounded')}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        eyeStyle === 'rounded' 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                    >
                      Lengkung
                    </button>
                    <button
                      onClick={() => setEyeStyle('circle')}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                        eyeStyle === 'circle' 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                    >
                      Bulat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Input */}
            <div className="p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60">
                    <Upload size={16} />
                  </div>
                  <h3 className="text-lg font-medium">Sisipkan Logo</h3>
                </div>
                
                {logoUrl && (
                  <button 
                    onClick={removeLogo}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trash2 size={14} /> Hapus Logo
                  </button>
                )}
              </div>

              {!logoUrl ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center hover:border-slate-400 dark:hover:border-white/30 transition-colors">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-white/40">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-white/70">Klik untuk mengunggah logo</p>
                      <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Mendukung format PNG, JPG, atau SVG (Rekomendasi dengan background transparan)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50 dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                  <div className="w-20 h-20 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white flex items-center justify-center p-2">
                    <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium tracking-wide text-slate-500 dark:text-white/50">Ukuran Logo</label>
                      <span className="text-xs font-mono text-slate-500">{logoSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="80" 
                      value={logoSize} 
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full accent-slate-900 dark:accent-white"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-white/30">Peringatan: Ukuran logo terlalu besar bisa membuat QR sulit dipindai.</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                <span className="text-xs font-medium text-slate-500 dark:text-white/50">Tingkat Koreksi Kesalahan (Error Correction)</span>
                <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                  {['L', 'M', 'Q', 'H'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setErrorLevel(level as any)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                        errorLevel === level 
                          ? 'bg-white dark:bg-[#222] shadow-sm text-slate-900 dark:text-white' 
                          : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                      }`}
                      title={
                        level === 'L' ? 'Low (7%)' : 
                        level === 'M' ? 'Medium (15%)' : 
                        level === 'Q' ? 'Quartile (25%)' : 'High (30% - Disarankan untuk Logo)'
                      }
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 p-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl transition-colors flex flex-col items-center text-center">
              <h3 className="text-lg font-medium mb-8 w-full text-left">Pratinjau</h3>
              
              <div 
                className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-none inline-block mb-8 transition-all"
                ref={qrRef}
              >
                {text ? (
                  <QRCode
                    value={text}
                    size={240}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    qrStyle={qrStyle}
                    eyeRadius={eyeStyle === 'square' ? 0 : eyeStyle === 'rounded' ? 8 : [20, 20, 20, 20]}
                    ecLevel={errorLevel}
                    quietZone={10}
                    logoImage={logoUrl || undefined}
                    logoWidth={logoUrl ? logoSize : undefined}
                    logoHeight={logoUrl ? logoSize : undefined}
                    removeQrCodeBehindLogo={true}
                  />
                ) : (
                  <div className="w-[240px] h-[240px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-sm text-slate-400">Masukkan konten</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={!text}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium tracking-widest uppercase rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} /> Unduh QR Code
              </button>
              
              <p className="text-[10px] text-slate-400 dark:text-white/30 mt-6">
                Selalu uji (scan) QR code dengan HP Anda sebelum digunakan untuk keperluan cetak.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
