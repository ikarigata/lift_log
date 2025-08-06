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

  // ログインページ初回表示時のみ古いトークンをクリア
  useEffect(() => {
    // 既にトークンがある場合（認証済み）はクリアしない
    const existingToken = localStorage.getItem('lift_log_auth_token');
    
    console.log('🧹 LoginPage mounted, checking if token clear needed:', {
      hasExistingToken: !!existingToken,
      currentPath: window.location.pathname
    });
    
    // トークンがない場合のみクリア（無駄なクリアを避ける）
    if (!existingToken) {
      console.log('🗑️ Clearing old tokens (no existing token found)');
      localStorage.removeItem('lift_log_auth_token');
      sessionStorage.clear();
    } else {
      console.log('🔒 Existing token found, skipping clear');
    }
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
        console.log('✅ Login response:', data);
        if (data.token) {
          // JWTトークンをlocalStorageに保存
          console.log('💾 Saving token:', data.token.substring(0, 20) + '...');
          saveToken(data.token);
          
          // トークン保存後、少し待ってから認証状態を更新
          setTimeout(() => {
            console.log('🔄 Calling onLoginSuccess after token save');
            onLoginSuccess();
            navigate('/');
          }, 100);
        }
      } else {
        console.error('❌ Login failed:', response.status, response.statusText);
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('ログイン処理中にエラーが発生しました。');
    }
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
    </div>
  );
};

export default LoginPage;
