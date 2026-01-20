
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHEDULE = 'SCHEDULE',
  MEMBERS = 'MEMBERS',
  FINANCE = 'FINANCE',
  AI_ASSISTANT = 'AI_ASSISTANT',
  MEMBER_PORTAL = 'MEMBER_PORTAL',
  LIBRARY = 'LIBRARY',
  ANALYTICS = 'ANALYTICS'
}

export type LiturgicalColor = 'GREEN' | 'RED' | 'WHITE' | 'VIOLET' | 'GOLD' | 'ROSE';

export type LiturgicalRank = 'SOLEMNITY' | 'FEAST' | 'MEMORIAL' | 'SUNDAY' | 'OPTIONAL';

export interface OrdoEvent {
  date: string;
  massName: string;
  liturgicalColor: LiturgicalColor;
  rank: LiturgicalRank;
  isObligatory: boolean; // Lễ buộc
  note: string;
}

export interface Member {
  id: string;
  saintName?: string;
  name: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  role: 'Ca trưởng' | 'Ca phó' | 'Thư ký' | 'Thủ quỹ' | 'Thành viên' | 'Nhạc công';
  instrument?: string;
  joinDate: string;
  birthDate?: string;
  groupName?: string;
  missionStatus: 'ACTIVE' | 'ON_LEAVE' | 'RETIRED';
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  category: string;
  lyrics?: string;
  pdfUrl?: string;
}

export interface ScheduleEvent {
  id: string;
  date: string;
  time: string;
  massName: string;
  type: 'MASS' | 'PRACTICE';
  liturgicalColor?: LiturgicalColor;
  songs?: string[]; // IDs of songs
  location: string;
}

export interface Transaction {
  id: string;
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
  records: AttendanceRecord[];
}
