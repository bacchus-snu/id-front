'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

enum RequestState {
  Idle,
  Pending,
  Done,
}
export default function EmailForm() {
  const { dict } = useLocaleDict();
  const passwordEmailDict = dict.changePassword.email;
  const showToast = useToast();

  const [email, setEmail] = useState('');
  const [requestState, setRequestState] = useState(RequestState.Idle);
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

    try {
      setRequestState(RequestState.Pending);
      const resp = await fetch('/password/email', {
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
      setRequestState(RequestState.Idle);
    }

    setRequestState(RequestState.Done);
  }

  if (requestState === RequestState.Done) {
    return (
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">{passwordEmailDict.emailSent.smallTitle}</h2>
        {passwordEmailDict.emailSent.descriptions.map((desc, index) => (
          // FIXME: 좀 더 제대로 된 i18n 라이브러리 써서 교체하기
          <p key={index} dangerouslySetInnerHTML={{ __html: desc }} />
        ))}
      </section>
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.changePassword}</h2>
      <p>{passwordEmailDict.description}</p>
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
          disabled={!valid || requestState !== RequestState.Idle}
        >
          {passwordEmailDict.buttonSendEmail}
        </Button>
      </form>
    </section>
  );
}
