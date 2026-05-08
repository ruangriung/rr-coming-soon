import React, { useState } from 'react';
import ImageGenerator from './ImageGenerator.tsx';
import VideoGenerator from './VideoGenerator.tsx';
import AudioGenerator from './AudioGenerator.tsx';
import ImageAnalysisAssistant from './ImageAnalysisAssistant.tsx';
import ChatAssistant from './ChatAssistant.tsx';
import BYOPHandler from './BYOPHandler.tsx';
import PaymentRequiredModal from './PaymentRequiredModal.tsx';
import { ImageIcon, Film, Volume2, Brain, MessageSquare, LayoutGrid } from 'lucide-react';

type TabType = 'image' | 'video' | 'audio' | 'analysis' | 'chat';

export default function Generator() {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [keyUpdateTrigger, setKeyUpdateTrigger] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentRequired = () => setIsPaymentModalOpen(true);

  const tabs = [
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'video', label: 'Video', icon: Film },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'analysis', label: 'Analysis', icon: Brain },
    { id: 'chat', label: 'Assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col items-center gap-8 md:gap-12 py-8 md:py-12 px-4">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-4 md:mb-8 p-6 md:p-8 bg-slate-100/50 dark:bg-white/[0.02] rounded-[2rem] md:rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-inner">
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 shadow-sm">
            <LayoutGrid size={12} className="text-orange-500" />
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest italic">All-in-One AI Platform</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            AI <span className="text-orange-500">Universal</span> Studio
          </h2>
          <p className="text-slate-500 dark:text-white/30 font-bold text-xs uppercase tracking-[0.3em]">
            Ekosistem Kecerdasan Buatan Terpadu oleh RuangRiung.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <BYOPHandler onKeyChange={() => setKeyUpdateTrigger(prev => prev + 1)} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full max-w-3xl bg-white dark:bg-white/5 p-2 rounded-3xl border border-slate-200 dark:border-white/10 flex gap-1 sticky top-24 z-40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl transition-all cursor-pointer ${
                isActive 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105 z-10' 
                : 'text-slate-400 dark:text-white/20 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white/60'
              }`}
            >
              <Icon size={isActive ? 22 : 18} className="transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Rendering */}
      <div className="w-full max-w-7xl" key={keyUpdateTrigger}>
        {activeTab === 'image' && <ImageGenerator onPaymentRequired={handlePaymentRequired} />}
        {activeTab === 'video' && <VideoGenerator onPaymentRequired={handlePaymentRequired} />}
        {activeTab === 'audio' && <AudioGenerator onPaymentRequired={handlePaymentRequired} />}
        {activeTab === 'analysis' && <ImageAnalysisAssistant onPaymentRequired={handlePaymentRequired} />}
        {activeTab === 'chat' && <ChatAssistant onPaymentRequired={handlePaymentRequired} />}
      </div>

      {/* Payment Required Modal */}
      <PaymentRequiredModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />

      {/* Footer Info */}
      <div className="text-center pt-24 pb-12 opacity-60 dark:opacity-20">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-slate-300 dark:bg-white" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] italic text-slate-500 dark:text-white">
            End-to-End AI Infrastructure
          </p>
          <div className="h-[1px] w-12 bg-slate-300 dark:bg-white" />
        </div>
        <p className="text-[8px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">
          Pollinations AI • RuangRiung • Vercel Edge • 2026
        </p>
      </div>
    </div>
  );
}
