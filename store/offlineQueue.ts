import { create } from 'zustand';

export type PendingChangeType =
  | 'ADD_MEMBER'
  | 'UPDATE_MEMBER'
  | 'DELETE_MEMBER'
  | 'ADD_TRANSACTION'
  | 'UPDATE_TRANSACTION'
  | 'DELETE_TRANSACTION';

export interface PendingChange {
  id: string;
  type: PendingChangeType;
  payload: any;
}

export const useOfflineQueue = create<{
  changes: PendingChange[];
  addChange: (c: PendingChange) => void;
  clear: () => void;
}>((set) => ({
  changes: [],
  addChange: (c) => set((s) => ({ changes: [...s.changes, c] })),
  clear: () => set({ changes: [] }),
}));

