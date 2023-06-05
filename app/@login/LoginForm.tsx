'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import Button from '../Button';
import { revalidateSession } from '../login';
import { useToast } from '../NotificationContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const showToast = useToast();

  function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loginPending) {
      return;
    }
    if (username === '' || password === '') {
      return;
    }

    setLoginPending(true);
    const resp = await fetch('/api/login', {
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
      setLoginPending(false);
      return;
    }

    revalidateSession();
  }

  return (
    <form
      className="flex flex-col items-stretch space-y-1 w-full max-w-xs mx-auto"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-row">
        <div className="w-20 flex-none text-right mr-2">Username</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          value={username}
          required
          onChange={handleUsernameChange}
        />
      </label>
      <label className="flex flex-row">
        <div className="w-20 flex-none text-right mr-2">Password</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          type="password"
          value={password}
          required
          onChange={handlePasswordChange}
        />
      </label>
      <Button className="font-bold" type="submit" disabled={loginPending}>
        로그인
      </Button>
    </form>
  );
}
