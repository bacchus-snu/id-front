import { Suspense } from 'react';

import { Email, listUserEmails } from './api';
import ChangePasswordForm from './ChangePasswordForm';

export default function ChangePassword() {
  const emailPromise = listUserEmails();
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">비밀번호 변경</h2>
      <p>
        비밀번호 변경 안내를 받을 이메일을 선택해 주세요.
      </p>
      <Suspense fallback={<ChangePasswordFormWrapper />}>
        <ChangePasswordFormWrapper emails={emailPromise} />
      </Suspense>
    </section>
  );
}

async function ChangePasswordFormWrapper(props: { emails?: Promise<Email[]> }) {
  const emails = await props.emails;
  return (
    <ChangePasswordForm emails={emails} />
  );
}
