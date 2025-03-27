import { create } from 'zustand';

export interface userDetails{
  nickname: string;
  token: string;
}

interface AuthStoreProps {
  loggedIn: boolean;
  user: userDetails | null;
  setUser: (user: userDetails) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStoreProps>((set) =>({
  loggedIn: false,
  user: null,
  setUser: (user: userDetails) => set({user: user, loggedIn: true}),
  logOut: () => set({user: null, loggedIn: false}),
}));