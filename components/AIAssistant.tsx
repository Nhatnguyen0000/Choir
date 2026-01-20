
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Music, Calendar, FileText, ExternalLink, Link2 } from 'lucide-react';
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
    { role: 'ai', content: 'Kính chào ban trị sự Ca Đoàn Giáo Xứ Bắc Hoà! Tôi là trợ lý AI đồng hành cùng anh chị trong công việc thánh nhạc tại Giáo phận Xuân Lộc. Hôm nay anh chị cần lập lịch phụng vụ, gợi ý bài hát cho lễ trọng hay soạn biên bản họp định kỳ?' }
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
    
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: response.text,
      sources: response.groundingMetadata?.groundingChunks 
    }]);
    setIsLoading(false);
  };

  const suggestions = [
    { label: "Lập lịch lễ Bắc Hoà", icon: <Calendar size={14} /> },
    { label: "Bài hát Phụng vụ", icon: <Music size={14} /> },
    { label: "Biên bản họp đoàn", icon: <FileText size={14} /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 overflow-auto p-4 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-[2.5rem] p-6 shadow-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none border border-white/20' 
                : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center space-x-2 mb-4 text-blue-400 border-b border-white/5 pb-3">
                  <div className="bg-blue-500/10 p-1.5 rounded-lg">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] font-serif">Hỗ Trợ Bắc Hoà</span>
                </div>
              )}
              <div className={`prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-sm lg:prose-base ${msg.role === 'user' ? 'prose-p:text-white' : 'prose-p:text-slate-300'}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nguồn tham khảo:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                      src.web && (
                        <a 
                          key={idx} 
                          href={src.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/10 transition-all duration-300 active:scale-95"
                        >
                          <div className="p-1 bg-white/10 group-hover:bg-white/20 rounded-md">
                            <Link2 size={12} />
                          </div>
                          <span className="text-[9px] font-bold truncate max-w-[120px]">{src.web.title || "Tài liệu Phụng vụ"}</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100" />
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
            <div className="bg-slate-900 rounded-3xl p-6 border border-white/5 rounded-tl-none flex items-center space-x-4 text-slate-400 shadow-sm">
              <div className="p-2 bg-white/5 rounded-xl">
                <Loader2 className="animate-spin text-blue-500" size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest italic text-slate-500">Đang tra cứu Ordo & Lời Chúa...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 p-5 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl mx-2 lg:mx-0">
        <div className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide pb-1">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setInput(s.label)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-400 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all shrink-0 active:scale-95 shadow-sm"
            >
              {s.icon}
              <span>{s.label}</span>
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
            placeholder="Ban Trị Sự cần hỗ trợ gì? (Lập lịch lễ, chọn bài...)"
            className="w-full pl-4 pr-16 py-4 bg-white/5 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white/10 border-none transition-all resize-none h-16 text-xs text-slate-200 placeholder:text-slate-500 font-bold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2.5 bottom-2.5 p-3 rounded-xl transition-all ${
              !input.trim() || isLoading 
                ? 'bg-white/5 text-slate-700' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg active:scale-95'
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