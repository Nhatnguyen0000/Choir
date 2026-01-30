
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHEDULE = 'SCHEDULE',
  MEMBERS = 'MEMBERS',
  FINANCE = 'FINANCE',
  LIBRARY = 'LIBRARY',
  ANALYTICS = 'ANALYTICS',
  MEMBER_PORTAL = 'MEMBER_PORTAL',
}

export type LiturgicalColor = 'GREEN' | 'RED' | 'WHITE' | 'VIOLET' | 'GOLD' | 'ROSE';
export type LiturgicalRank = 'SOLEMNITY' | 'FEAST' | 'SUNDAY' | 'OPTIONAL';
export type MemberStatus = 'ACTIVE' | 'ON_LEAVE' | 'RETIRED';
export type VoicePart = 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | 'Chưa phân phối';
export type Instrument = 'Organ' | 'Guitar' | 'Violin' | 'Khác' | 'Không';

// Added OrdoEvent interface for liturgical calendar entries
export interface OrdoEvent {
  date: string;
  massName: string;
  liturgicalColor: LiturgicalColor;
  rank: LiturgicalRank;
  isObligatory?: boolean;
  note?: string;
}

export interface Choir {
  id: string;
  name: string;
  parish: string;
}

export interface Member {
  id: string;
  choirId: string; // ID của ca đoàn trực thuộc
  saintName?: string;
  name: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  role: 'Ca trưởng' | 'Ca phó' | 'Thư ký' | 'Thủ quỹ' | 'Thành viên' | 'Nhạc công';
  grade?: string;
  birthYear?: string;
  avatar?: string;
  joinDate: string;
  status: MemberStatus;
}

export interface Song {
  id: string;
  choirId: string;
  title: string;
  composer: string;
  category: string;
  liturgicalSeasons: string[];
  isFamiliar: boolean;
  experienceNotes?: string;
}

export interface ScheduleEvent {
  id: string;
  choirId: string;
  date: string;
  time: string;
  massName: string;
  type: 'MASS' | 'PRACTICE'; 
  liturgicalColor: LiturgicalColor;
  location: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  choirId: string;
  date: string;
  description: string;
  amount: number;
  type: 'IN' | 'OUT';
  category: string;
}

export interface AttendanceRecord {
  memberId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface DailyAttendance {
  date: string;
  choirId: string;
  records: AttendanceRecord[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}
