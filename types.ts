
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHEDULE = 'SCHEDULE',
  MEMBERS = 'MEMBERS',
  FINANCE = 'FINANCE',
  LIBRARY = 'LIBRARY',
  ANALYTICS = 'ANALYTICS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  MEMBER_PORTAL = 'MEMBER_PORTAL',
}

export type LiturgicalColor = 'GREEN' | 'RED' | 'WHITE' | 'VIOLET' | 'GOLD' | 'ROSE';

export type LiturgicalRank = 'SOLEMNITY' | 'FEAST' | 'SUNDAY' | 'OPTIONAL';

export type MemberStatus = 'ACTIVE' | 'ON_LEAVE' | 'RETIRED';
export type VoicePart = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | 'Chưa phân phối';
export type Instrument = 'Organ' | 'Guitar' | 'Violin' | 'Khác' | 'Không';

export interface Member {
  id: string;
  saintName?: string;
  name: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  role: 'Ca trưởng' | 'Ca phó' | 'Thư ký' | 'Thủ quỹ' | 'Thành viên' | 'Nhạc công';
  voicePart?: VoicePart; // Deprecated as per user request
  grade?: string;        // Added "Lớp"
  birthYear?: string;    // Added "Năm sinh"
  instrument?: Instrument;
  avatar?: string;
  joinDate: string;
  status: MemberStatus;
  notes?: string;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  category: string;
  liturgicalSeasons: string[];
  isFamiliar: boolean;
  experienceNotes?: string;
  lyrics?: string;
}

export interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  massName: string;
  type: 'MASS' | 'PRACTICE'; 
  liturgicalColor: LiturgicalColor;
  location: string;
  organistId?: string;
  psalmistId?: string;
  leadSingerIds?: string[];
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'IN' | 'OUT';
  category: string;
  receiptUrl?: string;
}

export interface AttendanceRecord {
  memberId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  reportedAt?: string; 
  reason?: string;     
}

export interface DailyAttendance {
  date: string;
  records: AttendanceRecord[];
}

export interface OrdoEvent {
  date: string;
  massName: string;
  liturgicalColor: LiturgicalColor;
  rank: LiturgicalRank;
  isObligatory: boolean;
  note: string;
}
