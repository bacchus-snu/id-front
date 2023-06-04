'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { Email } from './api';

type Props = {
  emails: Email[];
};
export default function ChangePasswordForm(props: Props) {
  const [selectedEmail, setSelectedEmail] = useState('none');

  function handleEmailChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedEmail(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <form className="flex flex-col items-end space-y-1 mt-2" onSubmit={handleSubmit}>
      <select
        className="self-stretch bg-transparent border rounded p-1"
        value={selectedEmail}
        onChange={handleEmailChange}
      >
        {props.emails.map(({ local, domain }) => (
          <option key={`${local}@${domain}`} value={`${local}@${domain}`}>
            {local}@{domain}
          </option>
        ))}
      </select>
      <button className="w-full max-w-[8rem] font-bold border rounded p-1" type="submit">
        변경 신청
      </button>
    </form>
  );
}
