'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { mutate } from 'swr';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (username === '' || password === '') {
      return;
    }

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
      console.error(resp);
      return;
    }

    mutate('/api/check-login');
    router.push('/');
  }

  return (
    <form className="flex flex-col items-stretch space-y-1 w-80" onSubmit={handleSubmit}>
      <label className="flex flex-row">
        <div className="w-20 flex-none">Username</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          value={username}
          onChange={handleUsernameChange}
        />
      </label>
      <label className="flex flex-row">
        <div className="w-20 flex-none">Password</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <button className="font-bold border rounded" type="submit">
        로그인
      </button>
    </form>
  );
}