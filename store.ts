
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member, ScheduleEvent, Song, DailyAttendance, Transaction, AttendanceRecord, Choir, Notification } from './types';

interface AuthState {
  isAuthenticated: boolean;
  user: Member | null;
  choir: Choir | null;
  // Giữ lại hàm để tránh lỗi compile nhưng mặc định login luôn
  login: (user: Member, choir: Choir) => void;
  logout: () => void;
}

const defaultChoir: Choir = { id: 'c-thienthan', name: 'Ca đoàn Thiên Thần', parish: 'Giáo Xứ Bắsc Hòa' };
const defaultUser: Member = {
  id: 'usr-admin',
  choirId: 'c-thienthan',
  saintName: 'Phêrô',
  name: 'Ban Điều Hành',
  phone: '0901234567',
  gender: 'Nam',
  role: 'Ca trưởng',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'ACTIVE'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set: (partial: Partial<AuthState>) => void) => ({
      isAuthenticated: true, // Luôn luôn là true
      user: defaultUser,
      choir: defaultChoir,
      login: (user: Member, choir: Choir) => set({ isAuthenticated: true, user, choir }),
      logout: () => set({ isAuthenticated: true, user: defaultUser, choir: defaultChoir }), // Reset về mặc định thay vì logout
    }),
    { name: 'auth-storage-v3' }
  )
);

interface EventState {
  events: ScheduleEvent[];
  addEvent: (event: ScheduleEvent) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set: (partial: Partial<EventState> | ((state: EventState) => Partial<EventState>)) => void) => ({
      events: [],
      addEvent: (event: ScheduleEvent) => set((state: EventState) => ({ events: [event, ...state.events] })),
      updateEvent: (event: ScheduleEvent) => set((state: EventState) => ({ 
        events: state.events.map((e: ScheduleEvent) => e.id === event.id ? event : e) 
      })),
      deleteEvent: (id: string) => set((state: EventState) => ({ 
        events: state.events.filter((e: ScheduleEvent) => e.id !== id) 
      })),
    }),
    { name: 'event-storage-v3' }
  )
);

interface MemberState {
  members: Member[];
  attendanceData: DailyAttendance[];
  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;
  updateAttendance: (date: string, choirId: string, memberId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set: (partial: Partial<MemberState> | ((state: MemberState) => Partial<MemberState>)) => void) => ({
      members: [],
      attendanceData: [],
      addMember: (member: Member) => set((state: MemberState) => ({ members: [member, ...state.members] })),
      updateMember: (member: Member) => set((state: MemberState) => ({
        members: state.members.map((m: Member) => m.id === member.id ? member : m)
      })),
      deleteMember: (id: string) => set((state: MemberState) => ({
        members: state.members.filter((m: Member) => m.id !== id)
      })),
      updateAttendance: (date: string, choirId: string, memberId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => set((state: MemberState) => {
        const existingDateIdx = state.attendanceData.findIndex((d: DailyAttendance) => d.date === date && d.choirId === choirId);
        const newRecord: AttendanceRecord = { memberId, status };
        
        const newAttendanceData = [...state.attendanceData];
        if (existingDateIdx >= 0) {
          const records = [...newAttendanceData[existingDateIdx].records];
          const recordIdx = records.findIndex((r: AttendanceRecord) => r.memberId === memberId);
          if (recordIdx >= 0) records[recordIdx] = newRecord;
          else records.push(newRecord);
          newAttendanceData[existingDateIdx] = { ...newAttendanceData[existingDateIdx], records };
          return { attendanceData: newAttendanceData };
        } else {
          return { 
            attendanceData: [...state.attendanceData, { date, choirId, records: [newRecord] }] 
          };
        }
      }),
    }),
    { name: 'member-storage-v3' }
  )
);

interface LibraryState {
  songs: Song[];
  addSong: (song: Song) => void;
  updateSong: (song: Song) => void;
  deleteSong: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set: (partial: Partial<LibraryState> | ((state: LibraryState) => Partial<LibraryState>)) => void) => ({
      songs: [],
      addSong: (song: Song) => set((state: LibraryState) => ({ songs: [song, ...state.songs] })),
      updateSong: (song: Song) => set((state: LibraryState) => ({
        songs: state.songs.map((s: Song) => s.id === song.id ? song : s)
      })),
      deleteSong: (id: string) => set((state: LibraryState) => ({
        songs: state.songs.filter((s: Song) => s.id !== id)
      })),
    }),
    { name: 'library-storage-v3' }
  )
);

interface FinanceState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set: (partial: Partial<FinanceState> | ((state: FinanceState) => Partial<FinanceState>)) => void) => ({
      transactions: [],
      addTransaction: (transaction: Transaction) => set((state: FinanceState) => ({ transactions: [transaction, ...state.transactions] })),
      deleteTransaction: (id: string) => set((state: FinanceState) => ({
        transactions: state.transactions.filter((t: Transaction) => t.id !== id)
      })),
    }),
    { name: 'finance-storage-v3' }
  )
);

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set: (partial: Partial<NotificationState> | ((state: NotificationState) => Partial<NotificationState>)) => void) => ({
      notifications: [
        { id: '1', title: 'Chào mừng anh chị!', content: 'Hệ thống Ca Đoàn Thiên Thần đã sẵn sàng.', time: 'Vừa xong', isRead: false },
        { id: '2', title: 'Lịch công tác', content: 'Ban Điều Hành vui lòng cập nhật lịch lễ cho tuần mới.', time: '1 giờ trước', isRead: false }
      ],
      unreadCount: 2,
      addNotification: (n: Notification) => set((state: NotificationState) => ({ 
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1
      })),
      markAsRead: (id: string) => set((state: NotificationState) => ({
        notifications: state.notifications.map((n: Notification) => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      })),
    }),
    { name: 'notification-storage-v3' }
  )
);
