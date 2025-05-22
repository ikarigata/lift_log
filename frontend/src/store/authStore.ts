import { create } from "zustand";
import { User } from "@/types";
import { api } from "@/lib/api"; // APIモジュールをインポート

// 認証状態のストア
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>; // userId引数を削除
  logout: () => void;
  clearError: () => void;
}

// ハードコードされたユーザーID
const HARDCODED_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => { // userId引数を削除
    set({ isLoading: true, error: null });
    try {
      // APIを呼び出してユーザー情報を取得
      const userData = await api.users.getById(HARDCODED_USER_ID);
      // ログイン成功
      set({
        user: userData, // APIからのレスポンスをセット
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