import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { getDefaultSeedSongs } from './services/seedSongs';
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

// Id các bản ghi vừa insert từ client này — Realtime INSERT sẽ bỏ qua để tránh thêm trùng
const pendingInsertIds = {
  members: new Set<string>(),
  events: new Set<string>(),
  songs: new Set<string>(),
  transactions: new Set<string>(),
};

const saveToLocal = (state: Partial<AppState>) => {
  if (isSupabaseConfigured) return;
  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const merged = {
      members: state.members ?? prev.members ?? [],
      events: state.events ?? prev.events ?? [],
      songs: state.songs ?? prev.songs ?? [],
      transactions: state.transactions ?? prev.transactions ?? [],
      attendanceData: state.attendanceData ?? prev.attendanceData ?? [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  } catch { /* quota exceeded — silent */ }
};

const PENDING_TTL_MS = 30_000;
const schedulePendingCleanup = (bucket: Set<string>, id: string) => {
  setTimeout(() => bucket.delete(id), PENDING_TTL_MS);
};

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
      const localSongs = local.songs || [];
      const seedVersion = 2;
      const hasSeedV2 = localSongs.some((s: any) => typeof s.id === 'string' && s.id.startsWith('seed-') && Number(s.id.split('-')[1]) >= 30);
      const needReseed = localSongs.length === 0 || (local._seedVersion || 0) < seedVersion;
      const userSongs = localSongs.filter((s: any) => !(typeof s.id === 'string' && s.id.startsWith('seed-')));
      const songs = needReseed ? [...getDefaultSeedSongs(), ...userSongs] : localSongs;
      const next = {
        members: local.members || [],
        events: local.events || [],
        songs,
        transactions: local.transactions || [],
        attendanceData: local.attendanceData || [],
        isLoading: false,
        isCloudMode: false
      };
      set(next);
      if (needReseed) {
        const toSave = { ...local, songs, _seedVersion: seedVersion };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
      }
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
        const id = data?.id != null ? String(data.id) : '';
        if (!id) return;
        if (payload.eventType === 'INSERT' && pendingInsertIds.members.has(id)) {
          pendingInsertIds.members.delete(id);
          return;
        }
        set(state => {
          if (payload.eventType === 'INSERT') return { members: [...state.members.filter(m => String(m.id) !== id), data] };
          if (payload.eventType === 'UPDATE') return { members: state.members.map(m => m.id === data.id ? data : m) };
          if (payload.eventType === 'DELETE') return { members: state.members.filter(m => m.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule_events' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        const id = data?.id != null ? String(data.id) : '';
        if (!id) return;
        if (payload.eventType === 'INSERT' && pendingInsertIds.events.has(id)) {
          pendingInsertIds.events.delete(id);
          return;
        }
        set(state => {
          if (payload.eventType === 'INSERT') return { events: [...state.events.filter(e => String(e.id) !== id), data] };
          if (payload.eventType === 'UPDATE') return { events: state.events.map(e => e.id === data.id ? data : e) };
          if (payload.eventType === 'DELETE') return { events: state.events.filter(e => e.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'songs' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        const id = data?.id != null ? String(data.id) : '';
        if (!id) return;
        if (payload.eventType === 'INSERT' && pendingInsertIds.songs.has(id)) {
          pendingInsertIds.songs.delete(id);
          return;
        }
        set(state => {
          if (payload.eventType === 'INSERT') return { songs: [...state.songs.filter(s => String(s.id) !== id), data] };
          if (payload.eventType === 'UPDATE') return { songs: state.songs.map(s => s.id === data.id ? data : s) };
          if (payload.eventType === 'DELETE') return { songs: state.songs.filter(s => s.id !== data.id) };
          return state;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        const data = mapFromDB(payload.new || payload.old);
        const id = data?.id != null ? String(data.id) : '';
        if (!id) return;
        if (payload.eventType === 'INSERT' && pendingInsertIds.transactions.has(id)) {
          pendingInsertIds.transactions.delete(id);
          return;
        }
        set(state => {
          if (payload.eventType === 'INSERT') return { transactions: [...state.transactions.filter(t => String(t.id) !== id), data] };
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
    const id = String(member.id);
    pendingInsertIds.members.add(id);
    schedulePendingCleanup(pendingInsertIds.members, id);
    set(state => {
      const next = { members: [...state.members, member] };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').insert([toSnakeCase(member)]);
      if (error) {
        pendingInsertIds.members.delete(id);
        console.error('Supabase addMember:', error.message);
        set(state => ({ members: state.members.filter(m => m.id !== member.id) }));
      }
    }
  },

  updateMember: async (member) => {
    const prev = get().members.find(m => m.id === member.id);
    set(state => {
      const next = { members: state.members.map(m => m.id === member.id ? member : m) };
      saveToLocal({ ...state, ...next });
      return next;
    });
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
    set(state => {
      const next = { members: state.members.filter(m => m.id !== id) };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteMember:', error.message);
        set({ members: prev });
      }
    }
  },

  addEvent: async (event) => {
    const id = String(event.id);
    pendingInsertIds.events.add(id);
    schedulePendingCleanup(pendingInsertIds.events, id);
    set(state => {
      const next = { events: [...state.events, event] };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('schedule_events').insert([toSnakeCase(event)]);
      if (error) {
        pendingInsertIds.events.delete(id);
        console.error('Supabase addEvent:', error.message);
        set(state => ({ events: state.events.filter(e => e.id !== event.id) }));
      }
    }
  },

  updateEvent: async (event) => {
    const prev = get().events.find(e => e.id === event.id);
    set(state => {
      const next = { events: state.events.map(e => e.id === event.id ? event : e) };
      saveToLocal({ ...state, ...next });
      return next;
    });
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
    set(state => {
      const next = { events: state.events.filter(e => e.id !== id) };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('schedule_events').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteEvent:', error.message);
        set({ events: prev });
      }
    }
  },

  addSong: async (song) => {
    const id = String(song.id);
    pendingInsertIds.songs.add(id);
    schedulePendingCleanup(pendingInsertIds.songs, id);
    set(state => {
      const next = { songs: [...state.songs, song] };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('songs').insert([toSnakeCase(song)]);
      if (error) {
        pendingInsertIds.songs.delete(id);
        console.error('Supabase addSong:', error.message);
        set(state => ({ songs: state.songs.filter(s => s.id !== song.id) }));
      }
    }
  },

  updateSong: async (song) => {
    const prev = get().songs.find(s => s.id === song.id);
    set(state => {
      const next = { songs: state.songs.map(s => s.id === song.id ? song : s) };
      saveToLocal({ ...state, ...next });
      return next;
    });
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
    set(state => {
      const next = { songs: state.songs.filter(s => s.id !== id) };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteSong:', error.message);
        set({ songs: prev });
      }
    }
  },

  addTransaction: async (tx) => {
    const id = String(tx.id);
    pendingInsertIds.transactions.add(id);
    schedulePendingCleanup(pendingInsertIds.transactions, id);
    set(state => {
      const next = { transactions: [...state.transactions, tx] };
      saveToLocal({ ...state, ...next });
      return next;
    });
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('transactions').insert([toSnakeCase(tx)]);
      if (error) {
        pendingInsertIds.transactions.delete(id);
        console.error('Supabase addTransaction:', error.message);
        set(state => ({ transactions: state.transactions.filter(t => t.id !== tx.id) }));
      }
    }
  },

  deleteTransaction: async (id) => {
    const prev = get().transactions;
    set(state => {
      const next = { transactions: state.transactions.filter(t => t.id !== id) };
      saveToLocal({ ...state, ...next });
      return next;
    });
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
    saveToLocal({ ...get(), attendanceData: current });

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

const DEFAULT_USER = { name: 'Ban Điều Hành', role: 'Ban Điều Hành' };

export const useAuthStore = create<{
  user: { name: string; role: string } | null;
}>(() => ({
  user: DEFAULT_USER,
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
