import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDetails } from '../types/user';

interface AuthStoreProps {
  loggedIn: boolean;
  user: userDetails | null;
  setUser: (user: userDetails) => void;
  logOut: () => void;
  updateAccessToken: (newAccessToken: string) => void;
  updateRefreshToken: (newRefreshToken: string) => void;
}

export const useAuthStore = create<AuthStoreProps>()(
  persist(
    set => ({
      loggedIn: false,
      user: null,
      setUser: (user: userDetails) => set({ user : user, loggedIn: true }),
      logOut: () => set({ user: null, loggedIn: false }),
      updateAccessToken: (newAccessToken: string) => 
        set(state => state.user ? { user: { ...state.user, accessToken: newAccessToken } } : state),
      updateRefreshToken: (newRefreshToken: string) =>
        set(state => state.user ? { user: { ...state.user, refreshToken: newRefreshToken } } : state),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage), // React Native용 AsyncStorage 사용
    },
  ), 
);