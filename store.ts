
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

const defaultChoir: Choir = { id: 'c-thienthan', name: 'Ca đoàn Thiên Thần', parish: 'Bắc Hòa' };
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
    (set) => ({
      isAuthenticated: true, // Luôn luôn là true
      user: defaultUser,
      choir: defaultChoir,
      login: (user, choir) => set({ isAuthenticated: true, user, choir }),
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
    (set) => ({
      events: [],
      addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
      updateEvent: (event) => set((state) => ({ 
        events: state.events.map(e => e.id === event.id ? event : e) 
      })),
      deleteEvent: (id) => set((state) => ({ 
        events: state.events.filter(e => e.id !== id) 
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
    (set) => ({
      members: [],
      attendanceData: [],
      addMember: (member) => set((state) => ({ members: [member, ...state.members] })),
      updateMember: (member) => set((state) => ({
        members: state.members.map(m => m.id === member.id ? member : m)
      })),
      deleteMember: (id) => set((state) => ({
        members: state.members.filter(m => m.id !== id)
      })),
      updateAttendance: (date, choirId, memberId, status) => set((state) => {
        const existingDateIdx = state.attendanceData.findIndex(d => d.date === date && d.choirId === choirId);
        const newRecord: AttendanceRecord = { memberId, status };
        
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
    (set) => ({
      songs: [],
      addSong: (song) => set((state) => ({ songs: [song, ...state.songs] })),
      updateSong: (song) => set((state) => ({
        songs: state.songs.map(s => s.id === song.id ? song : s)
      })),
      deleteSong: (id) => set((state) => ({
        songs: state.songs.filter(s => s.id !== id)
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
    (set) => ({
      transactions: [],
      addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
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
    (set) => ({
      notifications: [
        { id: '1', title: 'Chào mừng anh chị!', content: 'Hệ thống Sổ Vàng Hiệp Thông Ca Đoàn Thiên Thần đã sẵn sàng.', time: 'Vừa xong', isRead: false },
        { id: '2', title: 'Lịch công tác', content: 'Ban Điều Hành vui lòng cập nhật lịch lễ cho tuần mới.', time: '1 giờ trước', isRead: false }
      ],
      unreadCount: 2,
      addNotification: (n) => set((state) => ({ 
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      })),
    }),
    { name: 'notification-storage-v3' }
  )
);
