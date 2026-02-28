import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { getAIResponse } from '../services/geminiService';
import type { ChatMessage } from '../services/geminiService';
import { parseAICommand, describeCommand, CommandType } from '../services/aiCommandService';
import { AppView } from '../types';
import ReactMarkdown from 'react-markdown';

export type OnExecuteCommand = (cmd: CommandType) => void;

interface AIAssistantProps {
  onNavigate?: (view: AppView) => void;
  onExecuteCommand?: OnExecuteCommand;
  initialPrompt?: string | null;
  onPromptConsumed?: () => void;
}

const WELCOME = `Chào anh chị! Tôi là **Trợ lý AI Ban Điều Hành Ca Đoàn Thiên Thần** — trả lời mọi câu hỏi như ChatGPT.

- Hỏi **bất cứ điều gì**: kiến thức chung, phụng vụ, thánh ca, Công giáo, kỹ thuật...
- **Ra lệnh**: *"Mở trang ngân quỹ"*, *"Chuyển sang Ca Viên"*, *"Thu 500k"*, *"Chi 200 nghìn"* — tôi sẽ thực hiện ngay.`;

const AIAssistant: React.FC<AIAssistantProps> = ({
  onNavigate,
  onExecuteCommand,
  initialPrompt,
  onPromptConsumed,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system'; content: string; sources?: any[] }[]>([
    { role: 'ai', content: WELCOME },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const query = params.get('q');
    if (query) {
      handleAutoSend(decodeURIComponent(query));
      window.location.hash = '#assistant';
    }
  }, []);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleAutoSend(initialPrompt.trim());
      onPromptConsumed?.();
    }
  }, [initialPrompt]);

  const buildHistory = (): ChatMessage[] => {
    return messages
      .filter((m): m is { role: 'user' | 'ai'; content: string } => m.role === 'user' || m.role === 'ai')
      .map((m) => ({ role: m.role, content: m.content }));
  };

  const handleAutoSend = async (prompt: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setIsLoading(true);

    const cmd = parseAICommand(prompt);
    if (cmd) {
      if (cmd.type === 'NAVIGATE' && onNavigate) onNavigate(cmd.view);
      if (onExecuteCommand) onExecuteCommand(cmd);
      setMessages((prev) => [...prev, { role: 'system', content: describeCommand(cmd) }]);
      setIsLoading(false);
      return;
    }

    const history = buildHistory();
    const response = await getAIResponse(prompt, history);
    setMessages((prev) => [
      ...prev,
      { role: 'ai', content: response.text, sources: response.groundingMetadata?.groundingChunks },
    ]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const cmd = parseAICommand(userMessage);
    if (cmd) {
      if (cmd.type === 'NAVIGATE' && onNavigate) onNavigate(cmd.view);
      if (onExecuteCommand) onExecuteCommand(cmd);
      setMessages((prev) => [...prev, { role: 'system', content: describeCommand(cmd) }]);
      setIsLoading(false);
      return;
    }

    const history = buildHistory();
    const response = await getAIResponse(userMessage, history);
    setMessages((prev) => [
      ...prev,
      { role: 'ai', content: response.text, sources: response.groundingMetadata?.groundingChunks },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full min-h-0 animate-fade-in">
      <div className="page-header-2026 shrink-0 pb-4">
        <h1 className="page-title">Trợ lý AI</h1>
        <p className="page-subtitle">Hỏi gì cũng được · Ra lệnh mở trang, thu chi</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
          >
            {msg.role === 'system' ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--success-bg)] border border-[var(--success)]/30 text-[var(--success)] text-xs font-medium max-w-[90%]">
                <CheckCircle2 size={14} />
                <span>{msg.content}</span>
              </div>
            ) : (
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary)] text-white rounded-br-md'
                    : 'glass-card rounded-bl-md'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2 text-[var(--foreground-muted)] border-b border-[var(--border)] pb-2">
                    <Sparkles size={14} className="text-[var(--primary)]" />
                    <span className="text-xs font-semibold">Trợ lý AI</span>
                  </div>
                )}
                <div className={`prose prose-sm max-w-none leading-relaxed ${msg.role === 'user' ? 'prose-invert text-white' : 'text-[var(--foreground)]'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={12} className="text-[var(--foreground-muted)]" />
                      <span className="text-xs font-semibold text-[var(--foreground-muted)]">Nguồn tham khảo</span>
                    </div>
                    <div className="space-y-2">
                      {msg.sources.map(
                        (src: any, idx: number) =>
                          src.web && (
                            <a
                              key={idx}
                              href={src.web.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--background-muted)] hover:bg-[var(--background-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)]"
                            >
                              <span className="truncate flex-1">{src.web.title || 'Tài liệu'}</span>
                              <ExternalLink size={12} className="text-[var(--foreground-muted)] shrink-0" />
                            </a>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-5 py-4 glass-card flex items-center gap-3">
              <Loader2 className="animate-spin text-[var(--primary)]" size={20} />
              <span className="text-sm text-[var(--foreground-muted)]">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="shrink-0 pt-2">
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
          {['Mở trang ngân quỹ', 'Chuyển sang Ca Viên', 'Thu 500k', 'Lịch phụng vụ tháng này', 'Giải thích RLS là gì'].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setInput((prev) => (prev ? prev + ' ' : '') + label)}
              className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground-muted)] text-xs font-medium whitespace-nowrap hover:bg-[var(--primary-muted)] hover:border-[var(--primary)]/30 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] backdrop-blur-sm p-2 shadow-[var(--shadow-xs)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 focus-within:border-[var(--primary)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi bất cứ điều gì hoặc ra lệnh (vd: Mở Ca Viên, Thu 500k)..."
            className="flex-1 min-h-[48px] max-h-32 px-4 py-3 rounded-xl resize-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] bg-[var(--background)]/50 border-0 focus:ring-0 focus:outline-none"
            rows={2}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-12 h-12 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Gửi"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
