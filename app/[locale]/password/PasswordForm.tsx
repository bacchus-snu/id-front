'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useToast } from '@/components/NotificationContext';

enum RequestState {
  Idle,
  Pending,
  Done,
}

type Props = {
  token?: string;
};
export default function PasswordForm({ token }: Props) {
  const showToast = useToast();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [requestState, setRequestState] = useState(RequestState.Idle);

  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setPassword(newValue);

    if (newValue !== passwordConfirm) {
      passwordConfirmRef.current?.setCustomValidity('두 비밀번호가 일치하지 않습니다.');
    } else {
      passwordConfirmRef.current?.setCustomValidity('');
    }
  }

  function handleChangePasswordConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setPasswordConfirm(newValue);

    if (password !== newValue) {
      e.target.setCustomValidity('두 비밀번호가 일치하지 않습니다.');
    } else {
      e.target.setCustomValidity('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (token == null) {
      return;
    }

    if (password !== passwordConfirm) {
      showToast({
        type: 'error',
        message: '두 비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    const body = {
      token,
      password,
    };

    try {
      setRequestState(RequestState.Pending);
      const resp = await fetch('/password/change', {
        method: 'post',
        body: JSON.stringify(body),
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

  if (token == null) {
    return (
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">비밀번호 변경</h2>
        <p>토큰을 확인하고 있습니다.</p>
      </section>
    );
  }

  if (requestState === RequestState.Done) {
    return (
      <>
        <section className="border rounded p-2 mb-2">
          <h2 className="text-h2 mb-2">비밀번호 변경 완료</h2>
          <p>새 비밀번호로 로그인해 주세요.</p>
        </section>
        <div className="flex flex-row-reverse">
          <Link className="text-link" href="/">홈으로 돌아가기</Link>
        </div>
      </>
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <InputField
            label="새 비밀번호"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={handleChangePassword}
          />
          <InputField
            ref={passwordConfirmRef}
            label="비밀번호 확인"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={handleChangePasswordConfirm}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          disabled={requestState !== RequestState.Idle}
          className="w-full font-bold mt-4"
        >
          비밀번호 변경
        </Button>
      </form>
    </section>
  );
}
