'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

type Mode = 'login' | 'register';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setInfo('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('パスワードが一致しません');
        return;
      }
      if (username.length < 2 || username.length > 20) {
        setError('ユーザー名は2〜20文字で入力してください');
        return;
      }
      if (!/^[a-zA-Z0-9_぀-ヿ一-鿿]+$/.test(username)) {
        setError('ユーザー名に使えない文字が含まれています');
        return;
      }
      if (password.length < 6) {
        setError('パスワードは6文字以上で入力してください');
        return;
      }

      setLoading(true);
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          const displayName = data.user?.user_metadata?.username ?? email;
          localStorage.setItem('pm-sim-auth', 'true');
          localStorage.setItem('pm-sim-username', displayName);
          onLogin(displayName);
        } else {
          setInfo('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。');
          switchMode('login');
        }
      } catch {
        setError('接続エラーが発生しました');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Login
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('メールアドレスまたはパスワードが違います');
        return;
      }

      const displayName = data.user?.user_metadata?.username ?? email;
      localStorage.setItem('pm-sim-auth', 'true');
      localStorage.setItem('pm-sim-username', displayName);
      onLogin(displayName);
    } catch {
      setError('接続エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  const loginDisabled = loading || !email || !password;
  const registerDisabled = loading || !username || !email || !password || !confirmPassword;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">PMシミュレーター</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'login' ? 'アカウントにログインしてください' : 'アカウントを作成してください'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-slate-600">
                ユーザー名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-600">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-600">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-slate-600">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再入力"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
              {error}
            </p>
          )}

          {info && (
            <p className="rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={mode === 'login' ? loginDisabled : registerDisabled}
            className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-500">
              アカウントをお持ちでない方は{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-semibold text-blue-600 hover:underline"
              >
                新規登録
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              すでにアカウントをお持ちの方は{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-blue-600 hover:underline"
              >
                ログイン
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
