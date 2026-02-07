
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
  realtimeStatus: 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'OFFLINE';
  
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

const LOCAL_STORAGE_KEY = 'thien_than_app_data_v2';

export const useAppStore = create<AppState>((set, get) => ({
  members: [],
  events: [],
  songs: [],
  transactions: [],
  attendanceData: [],
  isLoading: false,
  isCloudMode: isSupabaseConfigured,
  realtimeStatus: isSupabaseConfigured ? 'CONNECTING' : 'OFFLINE',

  fetchInitialData: async () => {
    set({ isLoading: true });
    
    if (!isSupabaseConfigured) {
      const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      set({ 
        members: local.members || [],
        events: local.events || [],
        songs: local.songs || [],
        transactions: local.transactions || [],
        attendanceData: local.attendanceData || [],
        isLoading: false,
        isCloudMode: false
      });
      return;
    }

    try {
      // Fetch đồng thời các bảng
      const [mRes, eRes, sRes, tRes, aRes] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('schedule_events').select('*'),
        supabase.from('songs').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('attendance').select('*')
      ]);

      // Kiểm tra lỗi RLS hoặc bảng không tồn tại
      if (mRes.error) console.error("Lỗi bảng members (Có thể do RLS):", mRes.error.message);
      if (eRes.error) console.error("Lỗi bảng events:", eRes.error.message);

      const groupedAttendance: DailyAttendance[] = [];
      (aRes.data || []).forEach((row: any) => {
        let group = groupedAttendance.find(g => g.date === row.date && g.choirId === row.choirId);
        if (!group) {
          group = { date: row.date, choirId: row.choirId, records: [] };
          groupedAttendance.push(group);
        }
        group.records.push({ memberId: row.memberId, status: row.status });
      });

      set({ 
        members: (mRes.data as Member[]) || [], 
        events: (eRes.data as ScheduleEvent[]) || [],
        songs: (sRes.data as Song[]) || [],
        transactions: (tRes.data as Transaction[]) || [],
        attendanceData: groupedAttendance,
        isLoading: false,
        isCloudMode: true
      });
    } catch (err) {
      console.error("Lỗi nghiêm trọng khi tải dữ liệu:", err);
      set({ isLoading: false, realtimeStatus: 'ERROR' });
    }
  },

  subscribeToChanges: () => {
    if (!isSupabaseConfigured) return () => {};

    console.log("🚀 Khởi tạo kênh đồng bộ Real-time...");
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public' }, 
        (payload) => {
          console.log('🔔 Phát hiện thay đổi dữ liệu:', payload.table, payload.eventType);
          // Tự động tải lại dữ liệu khi có bất kỳ thay đổi nào từ DB
          get().fetchInitialData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Trạng thái Real-time:', status);
        set({ realtimeStatus: status === 'SUBSCRIBED' ? 'CONNECTED' : 'ERROR' });
      });
      
    return () => {
      console.log("🔌 Ngắt kết nối Real-time.");
      supabase.removeChannel(channel);
    };
  },

  addMember: async (member) => {
    set(state => ({ members: [...state.members, member] }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').insert([member]);
      if (error) {
        console.error("Lỗi khi thêm ca viên vào Cloud:", error.message);
        alert("Không thể lưu vào Cloud. Kiểm tra quyền (RLS) trên Supabase.");
      }
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({...local, members: get().members}));
    }
  },

  updateMember: async (member) => {
    set(state => ({ members: state.members.map(m => m.id === member.id ? member : m) }));
    if (isSupabaseConfigured) {
      await supabase.from('members').update(member).eq('id', member.id);
    }
  },

  deleteMember: async (id) => {
    set(state => ({ members: state.members.filter(m => m.id !== id) }));
    if (isSupabaseConfigured) {
      await supabase.from('members').delete().eq('id', id);
    }
  },

  addEvent: async (event) => {
    set(state => ({ events: [...state.events, event] }));
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').insert([event]);
    }
  },

  updateEvent: async (event) => {
    set(state => ({ events: state.events.map(e => e.id === event.id ? event : e) }));
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').update(event).eq('id', event.id);
    }
  },

  deleteEvent: async (id) => {
    set(state => ({ events: state.events.filter(e => e.id !== id) }));
    if (isSupabaseConfigured) {
      await supabase.from('schedule_events').delete().eq('id', id);
    }
  },

  addSong: async (song) => {
    set(state => ({ songs: [...state.songs, song] }));
    if (isSupabaseConfigured) {
      await supabase.from('songs').insert([song]);
    }
  },

  updateSong: async (song) => {
    set(state => ({ songs: state.songs.map(s => s.id === song.id ? song : s) }));
    if (isSupabaseConfigured) {
      await supabase.from('songs').update(song).eq('id', song.id);
    }
  },

  deleteSong: async (id) => {
    set(state => ({ songs: state.songs.filter(s => s.id !== id) }));
    if (isSupabaseConfigured) {
      await supabase.from('songs').delete().eq('id', id);
    }
  },

  addTransaction: async (tx) => {
    set(state => ({ transactions: [...state.transactions, tx] }));
    if (isSupabaseConfigured) {
      await supabase.from('transactions').insert([tx]);
    }
  },

  deleteTransaction: async (id) => {
    set(state => ({ transactions: state.transactions.filter(t => t.id !== id) }));
    if (isSupabaseConfigured) {
      await supabase.from('transactions').delete().eq('id', id);
    }
  },

  updateAttendance: async (date, choirId, memberId, status) => {
    const current = [...get().attendanceData];
    let day = current.find(d => d.date === date && d.choirId === choirId);
    if (!day) {
      day = { date, choirId, records: [] };
      current.push(day);
    }
    const idx = day.records.findIndex(r => r.memberId === memberId);
    if (idx >= 0) day.records[idx].status = status as any;
    else day.records.push({ memberId, status: status as any });
    
    set({ attendanceData: current });

    if (isSupabaseConfigured) {
      // Upsert yêu cầu cột primary key hoặc unique constraint
      await supabase.from('attendance').upsert({ date, choirId, memberId, status }, { onConflict: 'date,memberId' });
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
  login: (user: any) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false }),
}));

export const useNotificationStore = create<any>((set) => ({
  notifications: [
    { id: '1', title: 'Hệ thống đã sẵn sàng', content: 'Dữ liệu đang được đồng bộ hóa với Cloud Supabase.', isRead: false }
  ],
  unreadCount: 1,
  markAsRead: (id: string) => set({ unreadCount: 0 })
}));
