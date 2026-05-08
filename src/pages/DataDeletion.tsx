import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, Mail, ShieldAlert, UserX, Clock } from 'lucide-react';

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link
            to="/"
            className="group flex items-center gap-3 w-fit px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali
          </Link>
        </div>

        <div className="glass-card p-12 md:p-16 mb-12">
          <div className="inline-flex p-4 rounded-2xl bg-red-500/10 text-red-500 mb-8 border border-red-500/20">
            <Trash2 size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">
            Penghapusan <span className="text-red-500">Data</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Kami menghormati hak Anda atas kendali data pribadi.
          </p>

          <div className="mt-16 space-y-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/60 leading-relaxed font-medium">
                Sesuai dengan regulasi perlindungan data, Anda memiliki hak untuk meminta penghapusan permanen seluruh data Anda dari sistem RuangRiung AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                  <UserX size={20} />
                </div>
                <h3 className="text-lg font-black text-white uppercase italic mb-4">Apa yang dihapus?</h3>
                <ul className="text-sm text-white/40 space-y-3 font-medium">
                  <li>• Profil pengguna dan identitas login</li>
                  <li>• Riwayat generasi prompt</li>
                  <li>• Pengaturan studio personal</li>
                  <li>• Metadata aktivitas</li>
                </ul>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-black text-white uppercase italic mb-4">Waktu Proses</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                  Permintaan Anda akan diproses dalam waktu maksimal 7 hari kerja. Setelah dihapus, data tidak dapat dipulihkan kembali.
                </p>
              </div>
            </div>

            <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-center">
              <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.3em] mb-6">Ajukan Penghapusan</h3>
              <p className="text-white/80 text-lg font-medium mb-8">
                Kirim email dengan subjek <span className="text-white font-bold italic">"Request Data Deletion"</span> ke:
              </p>
              <a 
                href="mailto:admin@ruangriung.my.id" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xl font-black text-white transition-all"
              >
                <Mail size={24} className="text-red-500" />
                admin@ruangriung.my.id
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
