/**
 * 用户状态管理
 * 使用Zustand管理全局用户数据
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../lib/db';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isLoading: true,
  error: null,
};

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user, isLoading: false, error: null }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      reset: () => set(initialState),
    }),
    { name: 'UserStore' }
  )
);
