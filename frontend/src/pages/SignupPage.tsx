import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
      await signup(email, password);
      setSuccessMessage('新規登録が成功しました。ログインページにリダイレクトします。');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('新規登録中に不明なエラーが発生しました。');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-primary text-content-accent font-dotgothic">
      <h1 className="text-6xl font-bold mb-8">lift_log</h1>
      <h2 className="text-2xl mb-6">新規登録</h2>
      <form onSubmit={handleSignup} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-80 p-2 mb-4 bg-input-bg text-input-text border-none rounded focus:outline-none placeholder:text-input-placeholder"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-80 p-2 mb-4 bg-input-bg text-input-text border-none rounded focus:outline-none placeholder:text-input-placeholder"
          required
        />
        <input
          type="password"
          placeholder="パスワード（確認）"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-80 p-2 mb-4 bg-input-bg text-input-text border-none rounded focus:outline-none placeholder:text-input-placeholder"
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <button
          type="submit"
          className="w-80 p-2 bg-interactive-primary text-content-inverse font-bold rounded border-none hover:bg-interactive-primary/80"
        >
          登録
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
