'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { mutate } from 'swr';
import Button from '../Button';

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
    <form className="flex flex-col items-stretch space-y-1 w-full max-w-xs mx-auto" onSubmit={handleSubmit}>
      <label className="flex flex-row">
        <div className="w-20 flex-none text-right mr-2">Username</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          value={username}
          onChange={handleUsernameChange}
        />
      </label>
      <label className="flex flex-row">
        <div className="w-20 flex-none text-right mr-2">Password</div>
        <input
          className="min-w-0 flex-1 bg-transparent border"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </label>
      <Button className="font-bold" type="submit">
        로그인
      </Button>
    </form>
  );
}
