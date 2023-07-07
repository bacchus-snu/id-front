'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { type SignupEmail } from '@/api';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

type Props = {
  token?: string;
  email?: SignupEmail;
};

export default function SignupForm({ token, email }: Props) {
  const showToast = useToast();
  const router = useRouter();
  const { dict } = useLocaleDict();
  const { signUp: { form: formDict } } = dict;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [requestPending, setRequestPending] = useState(false);

  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setPassword(newValue);

    if (newValue !== passwordConfirm) {
      passwordConfirmRef.current?.setCustomValidity(dict.validity.passwordConfirmMismatch);
    } else {
      passwordConfirmRef.current?.setCustomValidity('');
    }
  }

  function handleChangePasswordConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setPasswordConfirm(newValue);

    if (password !== newValue) {
      e.target.setCustomValidity(dict.validity.passwordConfirmMismatch);
    } else {
      e.target.setCustomValidity('');
    }
  }

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
        message: dict.error.unknown,
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
        <h2 className="text-h2 mb-2">{dict.title.signUp}</h2>
        <p>{dict.signUp.checkingEmail}</p>
      </section>
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.signUp}</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <InputField
            label={formDict.fields.email}
            readOnly
            disabled
            value={`${email.emailLocal}@${email.emailDomain}`}
            className="opacity-75"
          />
          <InputField
            label={formDict.fields.username}
            required
            pattern="[a-z][a-z0-9]*"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <InputField
            label={formDict.fields.password}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={handleChangePassword}
          />
          <InputField
            ref={passwordConfirmRef}
            label={formDict.fields.passwordConfirm}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={handleChangePasswordConfirm}
          />
        </div>
        <hr className="mt-4 mb-2" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="w-24 flex-none" />
            <p className="flex-1 pl-1">{formDict.administrativeInfo}</p>
          </div>
          <InputField
            label={formDict.fields.name}
            required
            placeholder={formDict.fields.namePlaceholder}
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <InputField
            label={formDict.fields.studentNumber}
            required
            pattern="\d{4}-\d{4,5}|\d{5}-\d{3}"
            placeholder="2023-12345"
            autoComplete="off"
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
          {formDict.signUpButton}
        </Button>
      </form>
    </section>
  );
}
