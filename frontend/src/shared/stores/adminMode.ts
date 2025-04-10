import { create } from 'zustand';

interface AdminModeStore {
    isAdminState: boolean;
    setAdminState: (va: boolean) => void;
    isAdminMode: boolean;
    setAdminMode: (val: boolean) => void;
};

export const useAdminModeStore = create<AdminModeStore>((set) => ({
    isAdminState: false,
    setAdminState: (val) => set({ isAdminState: val }),
    isAdminMode: false,
    setAdminMode: (val) => set({ isAdminMode: val }),

}));
