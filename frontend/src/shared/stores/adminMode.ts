import { create } from 'zustand';

interface AdminModeStore {
    isAdminMode: boolean;
    setAdminMode: (val: boolean) => void;
};

export const useAdminModeStore = create<AdminModeStore>((set) => ({
    isAdminMode: false,
    setAdminMode: (val) => set({ isAdminMode: val }),
}));
