'use client';

import { useState } from 'react';

import Button from '@/components/Button';

import { useToast } from '../NotificationContext';

enum RequestState {
  Idle,
  Pending,
  Done,
}
export default function EmailForm() {
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
        message: '알 수 없는 오류가 발생했습니다.',
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
        <h2 className="text-h2 mb-2">이메일 발송 완료</h2>
        <p>
          <strong>입력한 이메일로 가입된 유저가 존재하는 경우,</strong>{' '}
          해당 이메일로 안내 메일이 발송됩니다.
        </p>
        <p>메일이 도착할 때까지 시간이 걸릴 수 있습니다.</p>
      </section>
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">비밀번호 변경</h2>
      <p>
        계정에 연결된 이메일 주소를 입력하세요.
      </p>
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
          변경 메일 발송
        </Button>
      </form>
    </section>
  );
}
