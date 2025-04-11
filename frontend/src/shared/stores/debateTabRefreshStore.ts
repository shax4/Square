import { create } from 'zustand';

interface DebateTabRefreshStore {
    refreshKey: number;
    triggerRefresh: () => void;
}

export const useDebateTabRefreshStore = create<DebateTabRefreshStore>((set) => ({
    refreshKey: 0,
    triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
