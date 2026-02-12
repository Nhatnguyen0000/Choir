import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { Member, ScheduleEvent, Song, DailyAttendance, Transaction, AppView } from './types';

const toSnakeCase = (obj: any) => {
  if (!obj) return obj;
  const n: any = {};
  Object.keys(obj).forEach(k => {
    const newK = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    n[newK] = obj[k];
  });
  return n;
};

const mapFromDB = (row: any) => {
  if (!row) return row;
  const n: any = {};
  Object.keys(row).forEach(k => {
    const newK = k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    n[newK] = row[k];
  });
  return n;
};

interface AppState {
  members: Member[];
  events: ScheduleEvent[];
  songs: Song[];
  transactions: Transaction[];
  attendanceData: DailyAttendance[];
  isLoading: boolean;
  isCloudMode: boolean;
  realtimeStatus: 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'OFFLINE';
  
  fetchInitialData: () => Promise<void>;
  subscribeToChanges: () => () => void;
  
  addMember: (member: Member) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  addEvent: (event: ScheduleEvent) => Promise<void>;
  updateEvent: (event: ScheduleEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  addSong: (song: Song) => Promise<void>;
  updateSong: (song: Song) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;

  addTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
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
      const [mRes, eRes, sRes, tRes, aRes] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('schedule_events').select('*'),
        supabase.from('songs').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('attendance').select('*')
      ]);

      const hasError = mRes.error || eRes.error || sRes.error || tRes.error || aRes.error;
      if (hasError) {
        [mRes.error, eRes.error, sRes.error, tRes.error, aRes.error].forEach((err, i) => {
          if (err) console.error(`Supabase fetch error [${['members','schedule_events','songs','transactions','attendance'][i]}]:`, err.message);
        });
        set({ realtimeStatus: 'ERROR' });
      }

      const groupedAttendance: DailyAttendance[] = [];
      (aRes.data || []).forEach((row: any) => {
        const item = mapFromDB(row);
        let group = groupedAttendance.find(g => g.date === item.date && g.choirId === item.choirId);
        if (!group) {
          group = { date: item.date, choirId: item.choirId, records: [] };
          groupedAttendance.push(group);
        }
        group.records.push({ memberId: item.memberId, status: item.status });
      });

      set({ 
        members: (mRes.data || []).map(mapFromDB), 
        events: (eRes.data || []).map(mapFromDB),
        songs: (sRes.data || []).map(mapFromDB),
        transactions: (tRes.data || []).map(mapFromDB),
        attendanceData: groupedAttendance,
        isLoading: false,
        isCloudMode: true
      });
    } catch (err) {
      console.error("Fetch Error:", err);
      set({ isLoading: false, realtimeStatus: 'ERROR' });
    }
  },

  subscribeToChanges: () => {
    if (!isSupabaseConfigured) return () => {};
    
    const channel = supabase
      .channel('global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        set(state => {
          if (payload.eventType === 'INSERT') return { members: [...state.members, data] };
          if (payload.eventType === 'UPDATE') return { members: state.members.map(m => m.id === data.id ? data : m) };
          if (payload.eventType === 'DELETE') return { members: state.members.filter(m => m.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_events' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        set(state => {
          if (payload.eventType === 'INSERT') return { events: [...state.events, data] };
          if (payload.eventType === 'UPDATE') return { events: state.events.map(e => e.id === data.id ? data : e) };
          if (payload.eventType === 'DELETE') return { events: state.events.filter(e => e.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        set(state => {
          if (payload.eventType === 'INSERT') return { songs: [...state.songs, data] };
          if (payload.eventType === 'UPDATE') return { songs: state.songs.map(s => s.id === data.id ? data : s) };
          if (payload.eventType === 'DELETE') return { songs: state.songs.filter(s => s.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        set(state => {
          if (payload.eventType === 'INSERT') return { transactions: [...state.transactions, data] };
          if (payload.eventType === 'DELETE') return { transactions: state.transactions.filter(t => t.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
        get().fetchInitialData();
      })
      .subscribe((status) => {
        set({ realtimeStatus: status === 'SUBSCRIBED' ? 'CONNECTED' : 'ERROR' });
      });
      
    return () => supabase.removeChannel(channel);
  },

  addMember: async (member) => {
    set(state => ({ members: [...state.members, member] }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').insert([toSnakeCase(member)]);
      if (error) {
        console.error('Supabase addMember:', error.message);
        set(state => ({ members: state.members.filter(m => m.id !== member.id) }));
      }
    }
  },

  updateMember: async (member) => {
    const prev = get().members.find(m => m.id === member.id);
    set(state => ({ members: state.members.map(m => m.id === member.id ? member : m) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').update(toSnakeCase(member)).eq('id', member.id);
      if (error) {
        console.error('Supabase updateMember:', error.message);
        if (prev) set(state => ({ members: state.members.map(m => m.id === member.id ? prev : m) }));
      }
    }
  },

  deleteMember: async (id) => {
    const prev = get().members;
    set(state => ({ members: state.members.filter(m => m.id !== id) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteMember:', error.message);
        set({ members: prev });
      }
    }
  },

  addEvent: async (event) => {
    set(state => ({ events: [...state.events, event] }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('schedule_events').insert([toSnakeCase(event)]);
      if (error) {
        console.error('Supabase addEvent:', error.message);
        set(state => ({ events: state.events.filter(e => e.id !== event.id) }));
      }
    }
  },

  updateEvent: async (event) => {
    const prev = get().events.find(e => e.id === event.id);
    set(state => ({ events: state.events.map(e => e.id === event.id ? event : e) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('schedule_events').update(toSnakeCase(event)).eq('id', event.id);
      if (error) {
        console.error('Supabase updateEvent:', error.message);
        if (prev) set(state => ({ events: state.events.map(e => e.id === event.id ? prev : e) }));
      }
    }
  },

  deleteEvent: async (id) => {
    const prev = get().events;
    set(state => ({ events: state.events.filter(e => e.id !== id) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('schedule_events').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteEvent:', error.message);
        set({ events: prev });
      }
    }
  },

  addSong: async (song) => {
    set(state => ({ songs: [...state.songs, song] }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('songs').insert([toSnakeCase(song)]);
      if (error) {
        console.error('Supabase addSong:', error.message);
        set(state => ({ songs: state.songs.filter(s => s.id !== song.id) }));
      }
    }
  },

  updateSong: async (song) => {
    const prev = get().songs.find(s => s.id === song.id);
    set(state => ({ songs: state.songs.map(s => s.id === song.id ? song : s) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('songs').update(toSnakeCase(song)).eq('id', song.id);
      if (error) {
        console.error('Supabase updateSong:', error.message);
        if (prev) set(state => ({ songs: state.songs.map(s => s.id === song.id ? prev : s) }));
      }
    }
  },

  deleteSong: async (id) => {
    const prev = get().songs;
    set(state => ({ songs: state.songs.filter(s => s.id !== id) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteSong:', error.message);
        set({ songs: prev });
      }
    }
  },

  addTransaction: async (tx) => {
    set(state => ({ transactions: [...state.transactions, tx] }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('transactions').insert([toSnakeCase(tx)]);
      if (error) {
        console.error('Supabase addTransaction:', error.message);
        set(state => ({ transactions: state.transactions.filter(t => t.id !== tx.id) }));
      }
    }
  },

  deleteTransaction: async (id) => {
    const prev = get().transactions;
    set(state => ({ transactions: state.transactions.filter(t => t.id !== id) }));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteTransaction:', error.message);
        set({ transactions: prev });
      }
    }
  },

  updateAttendance: async (date, choirId, memberId, status) => {
    const current = JSON.parse(JSON.stringify(get().attendanceData));
    let day = current.find((d: any) => d.date === date && d.choirId === choirId);
    if (!day) {
      day = { date, choirId, records: [] };
      current.push(day);
    }
    const idx = day.records.findIndex((r: any) => r.memberId === memberId);
    if (idx >= 0) day.records[idx].status = status;
    else day.records.push({ memberId, status });
    
    set({ attendanceData: current });

    if (isSupabaseConfigured) {
      await supabase.from('attendance').upsert({ 
        date, 
        choir_id: choirId, 
        member_id: memberId, 
        status 
      }, { onConflict: 'date,member_id' });
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
    { id: '1', title: 'Chào mừng trở lại', content: 'Dữ liệu đang được đồng bộ hóa trực tuyến.', isRead: false }
  ],
  unreadCount: 1,
  markAsRead: (id: string) => set({ unreadCount: 0 })
}));

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}
export const useToastStore = create<{
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'error') => void;
  removeToast: (id: string) => void;
}>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
