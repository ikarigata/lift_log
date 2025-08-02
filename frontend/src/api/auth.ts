import { BASE_URL } from './config';

export const signup = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '新規登録に失敗しました。');
  }

  return response.json();
};
