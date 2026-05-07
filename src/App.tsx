/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Mail, Facebook, Construction, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] font-sans selection:bg-white/10 flex flex-col relative overflow-hidden border-8 border-[#1a1a1a]">
      {/* Decorative Grid Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header Section */}
      <header className="p-8 md:p-12 flex justify-between items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#666] mb-2 font-semibold font-sans">
            Digital Home / Ruang Temu
          </div>
          <h1 className="text-2xl font-light tracking-tighter text-white">
            ruangriung<span className="text-[#666]">.my.id</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
            <span className="text-[11px] uppercase tracking-widest text-[#888] font-medium">Maintenance Mode</span>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-8 md:px-12 flex flex-col justify-center flex-grow relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={itemVariants} className="text-[50px] md:text-[80px] leading-[0.9] font-light tracking-tight mb-8">
            RuangRiung <br/>
            <span className="italic font-serif text-[#888]">sedang dalam perbaikan.</span>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-base md:text-lg text-[#888] font-light max-w-md mb-12 leading-relaxed">
            Kami sedang menyempurnakan ruang kolaborasi digital ini secara bertahap. 
            Demi menghadirkan platform yang inklusif dan berkelanjutan, kami memilih untuk memprioritaskan kualitas sistem di atas kecepatan pengembangan.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
            <a 
              href="mailto:admin@ruangriung.my.id" 
              className="group flex flex-col border border-[#333] hover:border-[#666] p-6 rounded-sm transition-all duration-500 bg-[#0d0d0d]/50 hover:bg-[#111]"
              id="contact-email"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-3 font-semibold group-hover:text-[#888] transition-colors">Direct Inquiries</span>
              <span className="text-sm font-medium flex items-center gap-2">
                admin@ruangriung.my.id
                <ArrowRight className="w-3 h-3 text-[#333] group-hover:text-[#666] transition-all group-hover:translate-x-1" />
              </span>
            </a>
            
            <a 
              href="https://web.facebook.com/groups/1182261482811767/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col border border-[#333] hover:border-[#4267B2] p-6 rounded-sm transition-all duration-500 bg-[#0d0d0d]/50 hover:bg-[#4267B2]/5"
              id="facebook-group"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-3 font-semibold group-hover:text-[#4267B2] transition-colors">Join Community</span>
              <span className="text-sm font-medium flex items-center gap-2">
                Facebook Group
                <Facebook className="w-3 h-3 text-[#333] group-hover:text-[#4267B2] transition-all group-hover:translate-x-1" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Dynamic Aesthetic Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#0d0d0d] p-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-[#444] font-bold">Server Status</span>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-green-900/30"></div>
                <span className="text-[11px] font-mono text-green-600 tracking-tighter">PROVISIONING_ONLINE</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-[#444] font-bold">Build Progress</span>
              <div className="flex items-center gap-3">
                <div className="flex-grow bg-[#1a1a1a] h-1 max-w-[100px] overflow-hidden relative">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "easeInOut" 
                    }}
                    className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-green-600 to-transparent" 
                  />
                </div>
                <span className="text-[11px] font-mono text-[#888] animate-pulse">PROCESSING</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-[#444] font-bold">Release Cycle</span>
              <span className="text-[11px] font-mono text-[#888]">INDEPENDENT_PHASE</span>
            </div>

            <div className="flex flex-col gap-2 md:text-right md:items-end">
              <span className="text-[9px] uppercase tracking-widest text-[#444] font-bold">Inquiries</span>
              <span className="text-[11px] font-mono text-[#FFF] underline decoration-[#333] underline-offset-4 hover:decoration-[#666] transition-all cursor-pointer">
                admin@ruangriung.my.id
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#151515] flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-[#333] font-medium">
            <div className="flex items-center gap-4">
              <span>Status: Active Development</span>
              <div className="w-1 h-1 rounded-full bg-[#151515]" />
              <span>Optimizing Resource for Quality</span>
            </div>
            <span>&copy; {year} Ruang Riung Creative Community</span>
          </div>
        </div>
      </footer>

      {/* Large Faded Background Number */}
      <div className="absolute bottom-[-20px] right-[-50px] text-[350px] font-bold text-white opacity-[0.015] leading-none select-none pointer-events-none font-serif italic">
        RR
      </div>
    </div>
  );
}

