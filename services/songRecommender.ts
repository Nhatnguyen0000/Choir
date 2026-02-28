import { Song, Member } from '../types';

export const scoreSongForChoir = (song: Song, members: Member[]) => {
  let score = 0;
  if (song.isFamiliar) score += 2;
  if ((song.category || '').toLowerCase().includes('nhập lễ')) score += 1;
  const manySoprano = members.filter((m) => m.grade?.toLowerCase().includes('soprano')).length;
  if (manySoprano > members.length / 3) score += 1;
  return score;
};

export const recommendSongs = (songs: Song[], members: Member[], limit = 5) =>
  [...songs]
    .map((s) => ({ song: s, score: scoreSongForChoir(s, members) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.song);

