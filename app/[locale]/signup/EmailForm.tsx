'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

export default function EmailForm() {
  const showToast = useToast();
  const router = useRouter();
  const { dict } = useLocaleDict();

  const [email, setEmail] = useState('');
  const [requestPending, setRequestPending] = useState(false);
  const [valid, setValid] = useState(false);

  function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    setValid(e.target.checkValidity());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      return;
    }

    const [, domain] = email.split('@', 2);
    if (domain.toLowerCase() !== 'snu.ac.kr') {
      showToast({
        type: 'error',
        message: dict.error.emailSnuOnly,
      });
      return;
    }

    try {
      setRequestPending(true);
      const resp = await fetch('/signup/email', {
        method: 'post',
        body: JSON.stringify({ email }),
        headers: {
          'content-type': 'application/json',
        },
      });

      if (!resp.ok) {
        const body = await resp.json();
        const message = body?.message;
        if (message) {
          showToast({
            type: 'error',
            message,
          });
        }
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
      setRequestPending(false);
    }

    router.push('/signup/email-sent');
  }

  return (
    <form className="flex flex-row flex-wrap justify-end gap-2 mt-2" onSubmit={handleSubmit}>
      <input
        className="w-full flex-none sm:flex-1 bg-transparent border rounded p-1"
        type="email"
        required
        value={email}
        onChange={handleChangeEmail}
      />
      <Button
        className="flex-0 w-32 font-bold"
        color="primary"
        type="submit"
        disabled={!valid || requestPending}
      >
        {dict.signUp.email.buttonSendEmail}
      </Button>
    </form>
  );
}
