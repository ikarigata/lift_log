import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../api/config';
import { saveToken } from '../utils/auth';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // コンポーネントマウント時に古いトークンをクリア
  useEffect(() => {
    localStorage.removeItem('lift_log_auth_token');
    sessionStorage.clear();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          // JWTトークンをlocalStorageに保存
          saveToken(data.token);
          onLoginSuccess();
          navigate('/');
        }
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('ログイン処理中にエラーが発生しました。');
    }
  };

  // 開発用：入力なしでログイン
  const handleDevLogin = () => {
    onLoginSuccess();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-primary text-content-accent font-dotgothic">
      <h1 className="text-6xl font-bold mb-8">lift_log</h1>
      <form onSubmit={handleLogin} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-80 p-2 mb-4 bg-input-bg text-input-text border-none rounded focus:outline-none placeholder:text-input-placeholder"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 p-2 mb-4 bg-input-bg text-input-text border-none rounded focus:outline-none placeholder:text-input-placeholder"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-80 p-2 bg-interactive-primary text-content-inverse font-bold rounded border-none hover:bg-interactive-primary/80"
        >
          ログイン
        </button>
        <p className="mt-6 text-sm">
          アカウントをお持ちでないですか？{' '}
          <Link to="/signup" className="text-interactive-link hover:underline">
            新規登録
          </Link>
        </p>
      </form>
      
      {/* 開発用抜け穴ボタン */}
      <button
        onClick={handleDevLogin}
        className="mt-4 px-4 py-1 bg-interactive-secondary text-content-secondary text-sm font-dotgothic rounded border-none hover:bg-interactive-secondary/80 opacity-50 hover:opacity-70"
      >
        🔓 開発用ログイン
      </button>
    </div>
  );
};

export default LoginPage;
