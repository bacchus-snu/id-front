'use client';

import { useState } from 'react';

import type { Email } from '@/api';
import Button from '@/components/Button';

type Props = {
  emails?: Email[];
};
export default function ChangePasswordForm(props: Props) {
  const { emails } = props;
  const [selectedEmail, setSelectedEmail] = useState('0');
  const [requestPending, setRequestPending] = useState(false);

  function handleEmailChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedEmail(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emails == null) {
      return;
    }

    const email = emails[parseInt(selectedEmail, 10)];
    if (email == null) {
      return;
    }

    setRequestPending(true);
    window.setTimeout(() => {
      setRequestPending(false);
    }, 1000);
    console.log(email);
  }

  let emailOptions;
  if (emails == null) {
    emailOptions = <option value="0">불러오는 중...</option>;
  } else {
    emailOptions = emails.map(({ local, domain }, idx) => (
      <option key={`${local}@${domain}`} value={String(idx)}>
        {local}@{domain}
      </option>
    ));
  }

  return (
    <form className="flex flex-row flex-wrap justify-end gap-2 mt-2" onSubmit={handleSubmit}>
      <select
        className={'w-full flex-none sm:flex-1 bg-transparent border rounded p-1 '
          + (emails == null ? 'opacity-50' : '')}
        value={selectedEmail}
        disabled={emails == null}
        onChange={handleEmailChange}
      >
        {emailOptions}
      </select>
      <Button
        className="flex-0 w-32 font-bold"
        color="primary"
        type="submit"
        disabled={emails == null || requestPending}
      >
        변경 신청
      </Button>
    </form>
  );
}
