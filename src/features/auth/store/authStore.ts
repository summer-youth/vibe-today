import { create } from 'zustand';
import { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  nickname: string | null;
  setUser: (user: User | null) => void;
  setNickname: (nickname: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  nickname: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setNickname: (nickname) => set({ nickname }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      nickname: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

