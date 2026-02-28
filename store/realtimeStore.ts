import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface Peer {
  id: string;
  name: string;
  view: string;
}

interface PresenceState {
  peers: Peer[];
}

export const usePresenceStore = create<PresenceState>(() => ({
  peers: [],
}));

export const initPresenceChannel = (userId: string, name: string, view: string) => {
  const channel = supabase.channel('presence-global', {
    config: { presence: { key: userId } },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const peers = Object.entries(state).map(([id, metas]: any) => ({
        id,
        name: metas[0].name,
        view: metas[0].view,
      }));
      usePresenceStore.setState({ peers });
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ name, view });
      }
    });

  return channel;
};

