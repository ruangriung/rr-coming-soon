import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Zap, ArrowLeft, Shield, Eye, Database, Globe, Smartphone } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Informasi yang Kami Kumpulkan",
      icon: <Database size={20} />,
      content: "Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan. Data pribadi mencakup Nama, Alamat Email, dan URL Gambar Profil saat Anda melakukan otentikasi."
    },
    {
      title: "Penggunaan Data",
      icon: <Zap size={20} />,
      content: "Data Anda digunakan untuk memelihara layanan, mengelola akun, dan memberikan dukungan teknis. Kami tidak menjual data pribadi Anda kepada pihak ketiga."
    },
    {
      title: "Pihak Ketiga",
      icon: <Globe size={20} />,
      content: "Kami bekerja sama dengan penyedia layanan seperti Google (Auth), Pollinations.ai (AI Processing), dan Cloudflare (Hosting) untuk menunjang operasional Studio."
    },
    {
      title: "Keamanan",
      icon: <Shield size={20} />,
      content: "Kami menggunakan enkripsi standar industri untuk melindungi data Anda. Namun, perlu diingat bahwa tidak ada metode transmisi internet yang 100% aman."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium tracking-wide text-white/60 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Beranda
          </Link>
        </div>

        <div className="glass-card p-12 md:p-16 mb-12">
          <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 text-orange-500 mb-8 border border-orange-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
            Kebijakan <span className="text-orange-500">Privasi</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Terakhir diperbarui: 08 Mei 2026
          </p>

          <div className="mt-16 space-y-12">
            <p className="text-lg text-white/60 leading-relaxed font-medium">
              Di RuangRiung AI, privasi Anda adalah prioritas utama kami. Dokumen ini menjelaskan bagaimana kami mengelola informasi Anda saat Anda menggunakan Studio AI Multimedia kami.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-orange-500/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic mb-4">{section.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4">Kontak Privasi</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin mengajukan penghapusan data, silakan hubungi kami di: <br/>
                <span className="text-white font-bold">admin@ruangriung.my.id</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
