'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { type SignupEmail } from '@/api';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

import { useToast } from '../NotificationContext';

type Props = {
  token?: string;
  email?: SignupEmail;
};

export default function SignupForm({ token, email }: Props) {
  const showToast = useToast();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [requestPending, setRequestPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (token == null) {
      return;
    }

    const body = {
      token,
      username,
      password,
      name,
      studentNumbers: [studentNumber],
      preferredLanguage: 'ko',
    };

    try {
      setRequestPending(true);
      const resp = await fetch('/signup/create', {
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
      setRequestPending(false);
    }

    router.push('/signup/done');
  }

  if (email == null) {
    return (
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">가입하기</h2>
        <p>이메일 주소를 확인하고 있습니다.</p>
      </section>
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">가입하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <InputField
            label="이메일"
            readOnly
            disabled
            value={`${email.emailLocal}@${email.emailDomain}`}
            className="opacity-75"
          />
          <InputField
            label="유저명"
            required
            pattern="[a-z][a-z0-9]*"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <InputField
            label="비밀번호"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <hr className="mt-4 mb-2" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="w-24 flex-none" />
            <p className="flex-1 pl-1">아래 정보는 행정실에서 학적 확인을 위해 사용합니다.</p>
          </div>
          <InputField
            label="이름 (실명)"
            required
            placeholder="홍길동"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <InputField
            label="학번"
            required
            pattern="\d{4}-\d{4,5}|\d{5}-\d{3}"
            placeholder="2023-12345"
            value={studentNumber}
            onChange={e => setStudentNumber(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          disabled={requestPending}
          className="w-full font-bold mt-4"
        >
          가입하기
        </Button>
      </form>
    </section>
  );
}
