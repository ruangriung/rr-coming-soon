import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant({ onPaymentRequired }: { onPaymentRequired?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: 'openai'
        })
      });

      if (response.status === 402) {
        if (onPaymentRequired) onPaymentRequired();
        return;
      }

      if (!response.ok) throw new Error();
      const content = await response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (e) {
      toast.error("Gagal mendapatkan respon asisten.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden animate-in fade-in duration-700 shadow-2xl shadow-slate-200/50 dark:shadow-none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
            <Bot size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">RuangRiung AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[9px] text-green-600 dark:text-green-500 font-bold uppercase tracking-tighter">Sistem Aktif</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-slate-400 dark:text-white/20 hover:text-red-500 transition-all cursor-pointer"
          title="Hapus Percakapan"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 dark:opacity-20">
            <Sparkles size={48} className="text-slate-400 dark:text-white" />
            <p className="text-xs font-black text-slate-400 dark:text-white uppercase tracking-[0.2em]">Mulai obrolan baru</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-slate-900 text-white dark:bg-white/10 dark:text-white' : 'bg-orange-500 text-white'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white rounded-tr-none' 
                : 'bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-white/80 rounded-tl-none border border-slate-200 dark:border-white/5'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan sesuatu..."
            className="w-full h-14 pl-6 pr-16 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-orange-500/50 transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/30 text-white rounded-xl flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
