'use client';

import { useState } from 'react';

import { revalidateSession } from '@/api/session';
import { useToast } from '@/app/NotificationContext';
import Button from '@/components/Button';

export default function SignInForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pendingSignIn, setPendingSignIn] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pendingSignIn) {
      return;
    }
    if (username === '' || password === '') {
      return;
    }

    setPendingSignIn(true);
    const resp = await fetch('/session/signin', {
      method: 'post',
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!resp.ok) {
      showToast({
        type: 'error',
        message: '로그인에 실패했습니다.',
      });
      setPendingSignIn(false);
      return;
    }

    revalidateSession();
  }

  return (
    <form
      className="flex flex-col items-stretch space-y-1 w-full max-w-xs mx-auto"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-row items-baseline">
        <div className="w-20 flex-none text-right mr-2">유저명</div>
        <input
          className="min-w-0 flex-1 bg-transparent border rounded p-1"
          required
          pattern="[a-z][a-z0-9]+"
          autoFocus
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>
      <label className="flex flex-row items-baseline">
        <div className="w-20 flex-none text-right mr-2">비밀번호</div>
        <input
          className="min-w-0 flex-1 bg-transparent border rounded p-1"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <Button className="font-bold" type="submit" disabled={pendingSignIn}>
        로그인
      </Button>
    </form>
  );
}
