import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Key, Unplug, ShieldCheck, Github } from 'lucide-react';

export default function BYOPHandler({ onKeyChange }: { onKeyChange?: () => void }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('api_key=')) {
      const params = new URLSearchParams(hash.slice(1));
      const key = params.get('api_key');
      if (key) {
        localStorage.setItem('pollinations_api_key', key);
        setApiKey(key);
        if (onKeyChange) onKeyChange();
        window.history.replaceState(null, '', window.location.pathname);
        toast.success('Berhasil terhubung ke Pollinations Pro!');
      }
    } else {
      const storedKey = localStorage.getItem('pollinations_api_key');
      if (storedKey) setApiKey(storedKey);
    }
  }, [onKeyChange]);

  const handleConnect = () => {
    const params = new URLSearchParams({
      redirect_uri: window.location.origin + window.location.pathname,
      client_id: 'pk_hprMp1nmhXOvJE7H', 
      scope: 'usage keys',
      expiry: '30',
      budget: '10'
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('pollinations_api_key');
    setApiKey(null);
    if (onKeyChange) onKeyChange();
    toast.success('Koneksi Pollinations diputuskan.');
  };

  if (apiKey) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
        <ShieldCheck className="text-green-500" size={18} />
        <div className="flex-1">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Connected</p>
          <p className="text-[10px] font-mono text-white/40">sk_••••{apiKey.slice(-4)}</p>
        </div>
        <button onClick={handleDisconnect} className="p-2 text-white/40 hover:text-red-500 transition-colors">
          <Unplug size={16} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all w-full text-left"
    >
      <Key className="text-orange-500" size={18} />
      <div>
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Gunakan Pollen Sendiri (PRO)</p>
        <p className="text-[10px] text-white/40 font-bold">Hubungkan akun Pollinations Anda</p>
      </div>
    </button>
  );
}
