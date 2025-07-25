import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          onLoginSuccess();
          navigate('/');
        }
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
    } catch (err) {
      setError('ログイン処理中にエラーが発生しました。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-secondary text-content-accent font-dotgothic">
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
      </form>
    </div>
  );
};

export default LoginPage;
