import { useState } from 'react';

export type VoiceIntent =
  | { type: 'OPEN_LITURGY_TODAY' }
  | { type: 'OPEN_MEMBERS' }
  | { type: 'ADD_FINANCE'; amount: number; direction: 'IN' | 'OUT' }
  | { type: 'UNKNOWN' };

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);

  const parseTextToIntent = (text: string): VoiceIntent => {
    const lower = text.toLowerCase();
    if (lower.includes('mở lịch') || lower.includes('lịch chúa nhật')) {
      return { type: 'OPEN_LITURGY_TODAY' };
    }
    if (lower.includes('ca viên') || lower.includes('sổ bộ')) {
      return { type: 'OPEN_MEMBERS' };
    }
    const matchThu = lower.match(/(thu|thu vào)\s*(\d+)[k]?/);
    if (matchThu) {
      return { type: 'ADD_FINANCE', amount: Number(matchThu[2]) * 1000, direction: 'IN' };
    }
    return { type: 'UNKNOWN' };
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = 'vi-VN';
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript ?? '';
        const intent = parseTextToIntent(text);
        window.dispatchEvent(new CustomEvent('voice-intent', { detail: intent }));
      };
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return { isListening, startListening };
};

