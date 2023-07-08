import { Suspense } from 'react';

import { Email, listUserEmails } from '@/api';
import { Dict } from '@/locale';

import ChangePasswordForm from './ChangePasswordForm';

export default function ChangePassword({ dict }: { dict: Dict }) {
  const emailPromise = listUserEmails();
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.changePassword}</h2>
      <Suspense fallback={<ChangePasswordFormWrapper />}>
        <ChangePasswordFormWrapper emails={emailPromise} />
      </Suspense>
    </section>
  );
}

async function ChangePasswordFormWrapper(props: { emails?: Promise<Email[]> }) {
  const emails = await props.emails;
  return <ChangePasswordForm emails={emails} />;
}
