import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface userDetails{
  nickname: string;
  userType: string | null;
  token: string;
}

interface AuthStoreProps {
  loggedIn: boolean;
  user: userDetails | null;
  setUser: (user: userDetails) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStoreProps>()(
  persist(
    set => ({
      loggedIn: false,
      user: null,
      setUser: (user: userDetails) => set({ user : user, loggedIn: true }),
      logOut: () => set({ user: null, loggedIn: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage), // React Native용 AsyncStorage 사용
    },
  ), 
);