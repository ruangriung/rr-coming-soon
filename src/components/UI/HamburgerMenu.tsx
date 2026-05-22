/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Home, 
  Sparkles, 
  QrCode, 
  Image as ImageIcon, 
  BookOpen, 
  Newspaper, 
  Users, 
  Mail, 
  ShieldCheck, 
  FileText, 
  Trash2,
  ExternalLink,
  LogOut
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function HamburgerMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { path: '/', label: 'Beranda', icon: Home, number: '01' },
    { path: '/generator', label: 'Studio AI', icon: Sparkles, number: '02' },
    { path: '/qr-generator', label: 'QR Generator', icon: QrCode, number: '03' },
    { path: '/koleksi', label: 'Koleksi Karya', icon: ImageIcon, number: '04' },
    { path: '/kumpulan-prompt', label: 'Library Prompt', icon: BookOpen, number: '05' },
    { path: '/artikel', label: 'Jurnal & Artikel', icon: Newspaper, number: '06' },
    { path: '/tentang-kami', label: 'Tentang Kami', icon: Users, number: '07' },
    { path: '/kontak', label: 'Hubungi Kami', icon: Mail, number: '08' },
    { path: '/kebijakan-privasi', label: 'Kebijakan Privasi', icon: ShieldCheck, number: '09' },
    { path: '/ketentuan-layanan', label: 'Ketentuan Layanan', icon: FileText, number: '10' },
    { path: '/penghapusan-data', label: 'Hapus Data', icon: Trash2, number: '11' },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 md:top-6 md:right-8 z-[9999] w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white ${
          isOpen
            ? 'bg-transparent border-transparent shadow-none'
            : 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-900/5 dark:shadow-black/20'
        }`}
        aria-label="Toggle Menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </motion.div>
      </button>

      {/* Slide-over Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[9997]"
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-dvh w-full sm:w-[420px] bg-slate-50 dark:bg-[#0d0d0d] border-l border-slate-200 dark:border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl z-[9998] will-change-transform"
            >
              {/* Header inside drawer */}
              <div className="flex flex-col gap-1 pb-6 border-b border-slate-200/50 dark:border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                  Navigasi RuangRiung
                </span>
                <h2 className="text-xl font-light tracking-tight text-slate-900 dark:text-white">
                  ruangriung<span className="text-orange-500 font-serif italic">.my.id</span>
                </h2>
              </div>

              {/* Links list */}
              <nav 
                className="flex-grow flex flex-col gap-1 py-6 overflow-y-auto overscroll-contain custom-scrollbar [transform:translate3d(0,0,0)] [backface-visibility:hidden] will-change-[transform,scroll]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 font-semibold'
                          : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-orange-500/15 border-orange-500/20 text-orange-500' 
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-white/30 group-hover:text-orange-500 group-hover:border-orange-500/20'
                        }`}>
                          <Icon size={16} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs tracking-wide">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 dark:text-white/10 group-hover:text-orange-500/40 transition-colors">
                        {item.number}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 space-y-4">
                {user && (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                        alt={user.name} 
                        className="h-9 w-9 rounded-full border border-slate-200 dark:border-white/10 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800 dark:text-white/80 line-clamp-1 max-w-[180px]">{user.name}</span>
                        <span className="text-[9px] font-medium text-slate-400 dark:text-white/40 line-clamp-1 max-w-[180px]">{user.email}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="p-2 bg-slate-100 hover:bg-red-500/10 dark:bg-white/5 hover:dark:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-white/5 shadow-sm"
                      title="Keluar dari akun"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between py-1 border-b border-slate-200/30 dark:border-white/5 pb-4">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                    Pilih Tema
                  </span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                    Komunitas
                  </span>
                  <a
                    href="https://web.facebook.com/groups/1182261482811767/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-orange-500 dark:text-white/40 dark:hover:text-orange-500 transition-colors uppercase tracking-widest"
                  >
                    Facebook Group <ExternalLink size={10} />
                  </a>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-white/10 font-mono flex justify-between">
                  <span>© {new Date().getFullYear()} RuangRiung.</span>
                  <span>v1.0.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
