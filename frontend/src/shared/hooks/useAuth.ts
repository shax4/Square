import { useAuthStore } from '../stores/auth';

export const useAuth = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logOut = useAuthStore((state) => state.logOut);

  return {loggedIn, user, setUser, logOut};
};
