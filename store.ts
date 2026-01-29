
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member, ScheduleEvent, Song, DailyAttendance, Transaction, AttendanceRecord } from './types';

interface AuthState {
  isAuthenticated: boolean;
  user: Member | null;
  login: (user: Member) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'auth-storage' }
  )
);

interface EventState {
  events: ScheduleEvent[];
  setEvents: (events: ScheduleEvent[]) => void;
  addEvent: (event: ScheduleEvent) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateEvent: (event) => set((state) => ({ 
        events: state.events.map(e => e.id === event.id ? event : e) 
      })),
      deleteEvent: (id) => set((state) => ({ 
        events: state.events.filter(e => e.id !== id) 
      })),
    }),
    { name: 'event-storage' }
  )
);

interface MemberState {
  members: Member[];
  attendanceData: DailyAttendance[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;
  setAttendanceData: (data: DailyAttendance[]) => void;
  updateAttendance: (date: string, memberId: string, status: 'PRESENT' | 'ABSENT' | 'LATE', reason?: string) => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      members: [],
      attendanceData: [],
      setMembers: (members) => set({ members }),
      addMember: (member) => set((state) => ({ members: [member, ...state.members] })),
      updateMember: (member) => set((state) => ({
        members: state.members.map(m => m.id === member.id ? member : m)
      })),
      deleteMember: (id) => set((state) => ({
        members: state.members.filter(m => m.id !== id)
      })),
      setAttendanceData: (attendanceData) => set({ attendanceData }),
      updateAttendance: (date, memberId, status, reason) => set((state) => {
        const existingDateIdx = state.attendanceData.findIndex(d => d.date === date);
        const newRecord: AttendanceRecord = { memberId, status, reason, reportedAt: new Date().toISOString() };
        
        const newAttendanceData = [...state.attendanceData];
        if (existingDateIdx >= 0) {
          const records = [...newAttendanceData[existingDateIdx].records];
          const recordIdx = records.findIndex(r => r.memberId === memberId);
          
          if (recordIdx >= 0) records[recordIdx] = newRecord;
          else records.push(newRecord);
          
          newAttendanceData[existingDateIdx] = { ...newAttendanceData[existingDateIdx], records };
          return { attendanceData: newAttendanceData };
        } else {
          return { 
            attendanceData: [...state.attendanceData, { date, records: [newRecord] }] 
          };
        }
      }),
    }),
    { name: 'member-storage' }
  )
);

interface LibraryState {
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  addSong: (song: Song) => void;
  updateSong: (song: Song) => void;
  deleteSong: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      songs: [],
      setSongs: (songs) => set({ songs }),
      addSong: (song) => set((state) => ({ songs: [song, ...state.songs] })),
      updateSong: (song) => set((state) => ({
        songs: state.songs.map(s => s.id === song.id ? song : s)
      })),
      deleteSong: (id) => set((state) => ({
        songs: state.songs.filter(s => s.id !== id)
      })),
    }),
    { name: 'library-storage' }
  )
);

interface FinanceState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
      updateTransaction: (transaction) => set((state) => ({
        transactions: state.transactions.map(t => t.id === transaction.id ? transaction : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
    }),
    { name: 'finance-storage' }
  )
);

interface NotificationState {
  unreadCount: number;
  reportedEventIds: string[];
  markAsReported: (eventId: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      reportedEventIds: [],
      markAsReported: (eventId) => set((state) => ({ 
        reportedEventIds: [...state.reportedEventIds, eventId] 
      })),
    }),
    { name: 'notification-storage' }
  )
);
