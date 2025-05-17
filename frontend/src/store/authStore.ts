import { create } from "zustand";
import { User } from "@/types";

// 認証状態のストア
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // 実際のアプリでは認証APIを使用する
      // ここではモックのユーザーデータを使用
      const mockUser: User = {
        id: userId,
        name: "テストユーザー",
        createdAt: new Date().toISOString(),
      };
      // ログイン成功
      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // ログイン失敗
      set({
        error: error instanceof Error ? error.message : "ログインに失敗しました",
        isLoading: false,
      });
    }
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));