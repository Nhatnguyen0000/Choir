/**
 * Mùa phụng vụ — xác định theo lịch Rôma.
 * Màu sắc theo quy định: Tím (Vọng, Chay), Trắng/Vàng (Giáng Sinh, Phục Sinh), Xanh lá (Thường Niên).
 */

export type LiturgicalSeasonKey =
  | 'ADVENT'      // Mùa Vọng
  | 'CHRISTMAS'   // Giáng Sinh
  | 'ORDINARY_I'  // Thường Niên I (sau Chúa Giêsu Chịu Phép Rửa đến trước Mùa Chay)
  | 'LENT'        // Mùa Chay
  | 'TRIDUUM'     // Tam Nhật Thánh (có thể gộp với Easter cho đơn giản)
  | 'EASTER'      // Mùa Phục Sinh
  | 'ORDINARY_II'; // Thường Niên II (sau Chúa Nhật Hiện Xuống đến Mùa Vọng)

export interface SeasonColors {
  primary: string;
  primaryHover: string;
  primaryMuted: string;
  name: string;
}

/** Tính Chúa Nhật Phục Sinh (Anonymous Gregorian algorithm) */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Chúa Nhật thứ nhất Mùa Vọng = Chúa Nhật gần nhất trước hoặc vào 30/11 (tương đương 4 Chúa Nhật trước 25/12) */
function getFirstAdventSunday(year: number): Date {
  const dec25 = new Date(year, 11, 25);
  const dayOfWeek = dec25.getDay();
  const daysBack = dayOfWeek + 21;
  const firstAdvent = new Date(dec25);
  firstAdvent.setDate(dec25.getDate() - daysBack);
  return firstAdvent;
}

/** Lễ Chúa Giêsu Chịu Phép Rửa = Chúa Nhật sau 6/1 (Epiphany) — thường 13/1 hoặc gần đó */
function getBaptismOfLord(year: number): Date {
  const jan6 = new Date(year, 0, 6);
  let d = new Date(jan6);
  while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
  return d;
}

/** Chúa Nhật Hiện Xuống = Easter + 49 ngày */
function getPentecostSunday(year: number): Date {
  const easter = getEasterSunday(year);
  const p = new Date(easter);
  p.setDate(p.getDate() + 49);
  return p;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Trả về mùa phụng vụ cho một ngày.
 */
export function getLiturgicalSeason(date: Date): LiturgicalSeasonKey {
  const year = date.getFullYear();
  const key = toDateKey(date);
  const easter = getEasterSunday(year);
  const easterKey = toDateKey(easter);
  const ashWed = new Date(easter);
  ashWed.setDate(ashWed.getDate() - 46);
  const ashKey = toDateKey(ashWed);
  const holyThursday = new Date(easter);
  holyThursday.setDate(holyThursday.getDate() - 3);
  const baptism = getBaptismOfLord(year);
  const baptismKey = toDateKey(baptism);
  const pentecost = getPentecostSunday(year);
  const pentecostKey = toDateKey(pentecost);
  const firstAdvent = getFirstAdventSunday(year);
  const adventKey = toDateKey(firstAdvent);
  const christmasEve = `${year}-12-24`;
  const christmasDay = `${year}-12-25`;

  if (key >= adventKey && key <= christmasEve) return 'ADVENT';
  if (key >= christmasDay || (key >= `${year}-01-01` && key <= baptismKey)) return 'CHRISTMAS';
  if (key >= ashKey && key < toDateKey(holyThursday)) return 'LENT';
  if (key >= toDateKey(holyThursday) && key < easterKey) return 'TRIDUUM';
  if (key >= easterKey && key <= pentecostKey) return 'EASTER';
  if (key > pentecostKey && key < adventKey) return 'ORDINARY_II';
  return 'ORDINARY_I';
}

/** Màu chủ đạo theo mùa (dùng cho header, accent). Nguồn: màu phụng vụ Rôma. */
export const SEASON_COLORS: Record<LiturgicalSeasonKey, SeasonColors> = {
  ADVENT: {
    primary: '#6d28d9',
    primaryHover: '#5b21b6',
    primaryMuted: 'rgba(109, 40, 217, 0.15)',
    name: 'Mùa Vọng',
  },
  CHRISTMAS: {
    primary: '#d97706',
    primaryHover: '#b45309',
    primaryMuted: 'rgba(251, 191, 36, 0.2)',
    name: 'Giáng Sinh',
  },
  ORDINARY_I: {
    primary: '#15803d',
    primaryHover: '#166534',
    primaryMuted: 'rgba(34, 197, 94, 0.15)',
    name: 'Thường Niên',
  },
  LENT: {
    primary: '#6d28d9',
    primaryHover: '#5b21b6',
    primaryMuted: 'rgba(109, 40, 217, 0.15)',
    name: 'Mùa Chay',
  },
  TRIDUUM: {
    primary: '#b91c1c',
    primaryHover: '#991b1b',
    primaryMuted: 'rgba(185, 28, 28, 0.15)',
    name: 'Tam Nhật Thánh',
  },
  EASTER: {
    primary: '#ca8a04',
    primaryHover: '#a16207',
    primaryMuted: 'rgba(253, 224, 71, 0.2)',
    name: 'Phục Sinh',
  },
  ORDINARY_II: {
    primary: '#15803d',
    primaryHover: '#166534',
    primaryMuted: 'rgba(34, 197, 94, 0.15)',
    name: 'Thường Niên',
  },
};

export function getSeasonColors(date: Date): SeasonColors {
  const season = getLiturgicalSeason(date);
  return SEASON_COLORS[season];
}
