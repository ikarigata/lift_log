import { BASE_URL } from './config';

export const signup = async (email: string, password: string, name: string) => {
  
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      name,
      email, 
      passwordHash: password // バックエンドはpasswordHashフィールドを期待
    }),
  });

  if (!response.ok) {
    let errorMessage = '新規登録に失敗しました。';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSONパースエラーの場合はデフォルトメッセージを使用
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
