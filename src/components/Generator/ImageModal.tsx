import React from 'react';
import { X, Download, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex gap-4">
        <a 
          href={imageUrl} 
          download={`rr-ai-${Date.now()}.png`}
          onClick={(e) => e.stopPropagation()}
          className="p-3 bg-white/10 dark:bg-white/10 hover:bg-orange-500 text-white rounded-full transition-all border border-white/20 shadow-xl cursor-pointer"
        >
          <Download size={20} />
        </a>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 dark:bg-white/10 hover:bg-red-500 text-white rounded-full transition-all border border-white/20 shadow-xl cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div 
        className="relative max-w-5xl w-full flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt="AI Generated" 
          className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.2)] border border-white/20" 
        />
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <p className="text-[10px] font-black text-white/40 dark:text-white/40 uppercase tracking-[0.3em]">RuangRiung AI High Definition Preview</p>
        </div>
      </div>
    </div>
  );
}
