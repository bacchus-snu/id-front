'use client';

import { useState } from 'react';

import { revalidateSession } from '@/api/session';
import Button from '@/components/Button';
import { useToast } from '@/components/NotificationContext';
import useLocaleDict from '@/components/LocaleDict';

export default function SignInForm() {
  const { dict } = useLocaleDict();

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

    try {
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
          message: dict.error.signIn,
        });
        return;
      }
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        message: dict.error.unknown,
      });
      return;
    } finally {
      setPendingSignIn(false);
    }

    revalidateSession();
  }

  return (
    <form
      className="flex flex-col items-stretch space-y-1 w-full max-w-xs mx-auto"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-row items-baseline">
        <div className="w-20 flex-none text-right mr-2">{dict.signIn.username}</div>
        <input
          className="min-w-0 flex-1 bg-transparent border rounded p-1"
          required
          pattern="[a-z][a-z0-9]+"
          autoComplete="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>
      <label className="flex flex-row items-baseline">
        <div className="w-20 flex-none text-right mr-2">{dict.signIn.password}</div>
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
        {dict.signIn.signInButton}
      </Button>
    </form>
  );
}
