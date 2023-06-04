'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

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
      <button className="border rounded" type="submit">
        Login
      </button>
    </form>
  );
}
