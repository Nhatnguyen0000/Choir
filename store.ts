
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { Member, ScheduleEvent, Song, DailyAttendance, Transaction, AppView } from './types';

interface AppState {
  members: Member[];
  events: ScheduleEvent[];
  songs: Song[];
  transactions: Transaction[];
  attendanceData: DailyAttendance[];
  isLoading: boolean;
  isCloudMode: boolean;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  subscribeToChanges: () => () => void;
  
  // Members
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  // Events
  addEvent: (event: ScheduleEvent) => Promise<void>;
  updateEvent: (event: ScheduleEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Songs
  addSong: (song: Song) => Promise<void>;
  updateSong: (song: Song) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;

  // Finance
  addTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Attendance
  updateAttendance: (date: string, choirId: string, memberId: string, status: string) => Promise<void>;
}

// Helper để lưu/tải dữ liệu local
const LOCAL_STORAGE_KEY = 'thien_than_app_data';
const saveLocal = (data: Partial<AppState>) => {
  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...current, ...data }));
};

const loadLocal = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');

export const useAppStore = create<AppState>((set, get) => ({
  members: [],
  events: [],
  songs: [],
  transactions: [],
  attendanceData: [],
  isLoading: false,
  isCloudMode: isSupabaseConfigured,

  fetchInitialData: async () => {
    set({ isLoading: true });
    
    if (!isSupabaseConfigured) {
      // Chế độ Local
      const localData = loadLocal();
      set({ 
        members: localData.members || [],
        events: localData.events || [],
        songs: localData.songs || [],
        transactions: localData.transactions || [],
        attendanceData: localData.attendanceData || [],
        isLoading: false,
        isCloudMode: false
      });
      return;
    }

    try {
      const [members, events, songs, transactions, attendance] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('schedule_events').select('*'),
        supabase.from('songs').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('attendance').select('*')
      ]);

      const groupedAttendance: DailyAttendance[] = [];
      const rawAttendance = attendance.data || [];
      
      rawAttendance.forEach((row: any) => {
        let group = groupedAttendance.find(g => g.date === row.date && g.choirId === row.choirId);
        if (!group) {
          group = { date: row.date, choirId: row.choirId, records: [] };
          groupedAttendance.push(group);
        }
        group.records.push({ memberId: row.memberId, status: row.status as any });
      });

      set({ 
        members: (members.data as Member[]) || [], 
        events: (events.data as ScheduleEvent[]) || [],
        songs: (songs.data as Song[]) || [],
        transactions: (transactions.data as Transaction[]) || [],
        attendanceData: groupedAttendance,
        isLoading: false,
        isCloudMode: true
      });
    } catch (error) {
      console.error('Supabase fetch failed, falling back to local:', error);
      const localData = loadLocal();
      set({ 
        members: localData.members || [],
        isLoading: false,
        isCloudMode: false 
      });
    }
  },

  subscribeToChanges: () => {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        get().fetchInitialData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  },

  addMember: async (member) => {
    const newMembers = [...get().members, member];
    set({ members: newMembers });
    if (isSupabaseConfigured) {
      await supabase.from('members').insert(member);
    } else {
      saveLocal({ members: newMembers });
    }
  },

  updateMember: async (member) => {
    const newMembers = get().members.map(m => m.id === member.id ? member : m);
    set({ members: newMembers });
    if (isSupabaseConfigured) {
      await supabase.from('members').update(member).eq('id', member.id);
    } else {
      saveLocal({ members: newMembers });
    }
  },

  deleteMember: async (id) => {
    const newMembers = get().members.filter(m => m.id !== id);
    set({ members: newMembers });
    if (isSupabaseConfigured) {
      await supabase.from('members').delete().eq('id', id);
    } else {
      saveLocal({ members: newMembers });
    }
  },

  addEvent: async (event) => {
    const newEvents = [...get().events, event];
    set({ events: newEvents });
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').insert(event);
    } else {
      saveLocal({ events: newEvents });
    }
  },

  updateEvent: async (event) => {
    const newEvents = get().events.map(e => e.id === event.id ? event : e);
    set({ events: newEvents });
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').update(event).eq('id', event.id);
    } else {
      saveLocal({ events: newEvents });
    }
  },

  deleteEvent: async (id) => {
    const newEvents = get().events.filter(e => e.id !== id);
    set({ events: newEvents });
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').delete().eq('id', id);
    } else {
      saveLocal({ events: newEvents });
    }
  },

  addSong: async (song) => {
    const newSongs = [...get().songs, song];
    set({ songs: newSongs });
    if (isSupabaseConfigured) {
      await supabase.from('songs').insert(song);
    } else {
      saveLocal({ songs: newSongs });
    }
  },

  updateSong: async (song) => {
    const newSongs = get().songs.map(s => s.id === song.id ? song : s);
    set({ songs: newSongs });
    if (isSupabaseConfigured) {
      await supabase.from('songs').update(song).eq('id', song.id);
    } else {
      saveLocal({ songs: newSongs });
    }
  },

  deleteSong: async (id) => {
    const newSongs = get().songs.filter(s => s.id !== id);
    set({ songs: newSongs });
    if (isSupabaseConfigured) {
      await supabase.from('songs').delete().eq('id', id);
    } else {
      saveLocal({ songs: newSongs });
    }
  },

  addTransaction: async (tx) => {
    const newTransactions = [...get().transactions, tx];
    set({ transactions: newTransactions });
    if (isSupabaseConfigured) {
      await supabase.from('transactions').insert(tx);
    } else {
      saveLocal({ transactions: newTransactions });
    }
  },

  deleteTransaction: async (id) => {
    const newTransactions = get().transactions.filter(t => t.id !== id);
    set({ transactions: newTransactions });
    if (isSupabaseConfigured) {
      await supabase.from('transactions').delete().eq('id', id);
    } else {
      saveLocal({ transactions: newTransactions });
    }
  },

  updateAttendance: async (date, choirId, memberId, status) => {
    const currentData = [...get().attendanceData];
    let day = currentData.find(d => d.date === date && d.choirId === choirId);
    
    if (!day) {
      day = { date, choirId, records: [] };
      currentData.push(day);
    }
    
    const recordIdx = day.records.findIndex(r => r.memberId === memberId);
    if (recordIdx >= 0) {
      day.records[recordIdx].status = status as any;
    } else {
      day.records.push({ memberId, status: status as any });
    }
    
    set({ attendanceData: currentData });

    if (isSupabaseConfigured) {
      await supabase.from('attendance').upsert({ date, choirId, memberId, status });
    } else {
      saveLocal({ attendanceData: currentData });
    }
  }
}));

export const useMemberStore = useAppStore;
export const useEventStore = useAppStore;
export const useFinanceStore = useAppStore;
export const useLibraryStore = useAppStore;

export const useAuthStore = create<any>((set) => ({
  isAuthenticated: true,
  user: { name: 'Ban Điều Hành', role: 'Ca trưởng' },
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));

export const useNotificationStore = create<any>((set) => ({
  notifications: [
    { id: '1', title: 'Hệ thống hiệp thông Cloud', content: isSupabaseConfigured ? 'Kết nối Cloud hoạt động.' : 'Đang sử dụng bộ nhớ nội bộ.', isRead: false }
  ],
  unreadCount: 1,
  markAsRead: (id: string) => set({ unreadCount: 0 })
}));
