
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Music, Calendar, FileText, Link2 } from 'lucide-react';
import { getAIResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ initialPrompt, onPromptConsumed }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; sources?: any[] }[]>([
    { role: 'ai', content: 'Kính chào Ban Điều Hành Ca Đoàn Thiên Thần! Nguyện bình an của Chúa ở cùng anh chị! Tôi là Trợ lý AI v2.0, sẵn sàng hiệp thông hỗ trợ anh chị trong mọi công tác Phụng vụ.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleAutoSend(initialPrompt);
      onPromptConsumed?.();
    }
  }, [initialPrompt]);

  const handleAutoSend = async (prompt: string) => {
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setIsLoading(true);
    const response = await getAIResponse(prompt);
    // Fix: Accessing groundingMetadata which is now provided by the updated getAIResponse service
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: response.text,
      sources: response.groundingMetadata?.groundingChunks 
    }]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await getAIResponse(userMessage);
    
    // Fix: Accessing groundingMetadata which is now provided by the updated getAIResponse service
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: response.text,
      sources: response.groundingMetadata?.groundingChunks 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] space-y-4 animate-fade-in">
      <div className="flex-1 overflow-auto px-2 space-y-6 scrollbar-hide pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none border-slate-800' 
                : 'glass-card rounded-tl-none border-slate-200'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 mb-3 text-amberGold border-b border-slate-100 pb-2">
                  <Sparkles size={14} className="fill-amberGold" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Trợ Lý Phụng Vụ</span>
                </div>
              )}
              <div className={`prose prose-sm max-w-none leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nguồn tham khảo:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      src.web && (
                        <a 
                          key={idx} 
                          href={src.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-slate-50 hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-all text-[10px] font-bold text-slate-600 shadow-sm"
                        >
                          <Link2 size={10} />
                          <span className="truncate max-w-[120px]">{src.web.title || "Xem"}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3 text-slate-400 border-slate-200">
              <Loader2 className="animate-spin text-amberGold" size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest italic">Đang suy ngẫm...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="glass-card p-4 rounded-xl border-slate-200 shadow-lg bg-white/80">
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
           {["Mùa Phục Sinh", "Biên bản họp", "Bài hát Đức Mẹ"].map(label => (
             <button 
               key={label}
               onClick={() => setInput(prev => prev + label)}
               className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-slate-500 hover:text-amberGold transition-all whitespace-nowrap"
             >
               {label}
             </button>
           ))}
        </div>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Trao đổi cùng Trợ lý AI..."
            className="w-full pl-4 pr-14 py-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-amberGold transition-all resize-none h-16 text-[13px] font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2.5 rounded-lg transition-all ${
              !input.trim() || isLoading 
                ? 'bg-slate-100 text-slate-300' 
                : 'active-pill shadow-sm active:scale-95'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
