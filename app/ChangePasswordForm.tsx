'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { Email } from './api';
import Button from './Button';

type Props = {
  emails: Email[];
};
export default function ChangePasswordForm(props: Props) {
  const [selectedEmail, setSelectedEmail] = useState('0');
  const [requestPending, setRequestPending] = useState(false);

  function handleEmailChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedEmail(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const email = props.emails[parseInt(selectedEmail, 10)];
    if (email == null) {
      return;
    }

    setRequestPending(true);
    window.setTimeout(() => {
      setRequestPending(false);
    }, 1000);
    console.log(email);
  }

  return (
    <form className="flex flex-row flex-wrap justify-end gap-2 mt-2" onSubmit={handleSubmit}>
      <select
        className="w-full flex-none sm:flex-1 bg-transparent border rounded p-1"
        value={selectedEmail}
        onChange={handleEmailChange}
      >
        {props.emails.map(({ local, domain }, idx) => (
          <option key={`${local}@${domain}`} value={String(idx)}>
            {local}@{domain}
          </option>
        ))}
      </select>
      <Button
        className="w-32 flex-0 font-bold"
        color="primary"
        type="submit"
        disabled={requestPending}
      >
        변경 신청
      </Button>
    </form>
  );
}
