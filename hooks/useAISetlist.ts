import { useState } from 'react';
import { Song } from '../types';
import { getAIResponse } from '../services/geminiService';

export interface LiturgyDayInfo {
  name: string;
  season: string;
  rank: string;
  date: string;
}

interface SetlistItem {
  title: string;
  composer?: string;
  reason: string;
}

export const useAISetlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSetlist = async (
    liturgyDay: LiturgyDayInfo,
    songs: Song[],
    recentSongIds: string[]
  ): Promise<SetlistItem[]> => {
    setIsLoading(true);
    setError(null);

    const recentTitles = songs
      .filter((s) => recentSongIds.includes(s.id))
      .map((s) => s.title)
      .join(', ');

    const prompt = `
Tạo setlist 5-7 bài cho ${liturgyDay.name} (${liturgyDay.season}, ${liturgyDay.rank}, Năm A).
Các bài hát có trong thư viện: ${songs.map((s) => s.title).join(', ')}.
Các bài đã dùng gần đây: ${recentTitles || 'không có'}.
Giọng ca đoàn: SATB.
Chỉ trả về JSON hợp lệ dạng:
[{ "title": string, "composer": string, "reason": string }].`;

    try {
      const res = await getAIResponse(prompt);
      const text = res.text || '[]';
      const parsed = JSON.parse(text) as SetlistItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('useAISetlist error', e);
      setError('Không tạo được setlist AI. Vui lòng thử lại sau.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { generateSetlist, isLoading, error };
};

