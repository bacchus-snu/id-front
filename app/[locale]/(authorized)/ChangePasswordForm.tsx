'use client';

import { useState } from 'react';

import type { Email } from '@/api';
import Button from '@/components/Button';
import { useToast } from '@/components/NotificationContext';

enum RequestState {
  Idle,
  Pending,
  Done,
}

type Props = {
  emails?: Email[];
};
export default function ChangePasswordForm(props: Props) {
  const showToast = useToast();

  const { emails } = props;
  const [selectedEmail, setSelectedEmail] = useState('0');
  const [requestState, setRequestState] = useState(RequestState.Idle);

  function handleEmailChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedEmail(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emails == null) {
      return;
    }

    const email = emails[parseInt(selectedEmail, 10)];
    if (email == null) {
      return;
    }

    try {
      setRequestState(RequestState.Pending);
      const resp = await fetch('/password/email', {
        method: 'post',
        body: JSON.stringify({ email: `${email.local}@${email.domain}` }),
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
      <>
        <p>안내 메일이 전송되었습니다. 메일함을 확인해 주세요.</p>
        <p>메일이 도착할 때까지 시간이 걸릴 수 있습니다.</p>
      </>
    );
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
    <>
      <p>
        비밀번호 변경 안내를 받을 이메일을 선택해 주세요.
      </p>
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
          disabled={emails == null || requestState !== RequestState.Idle}
        >
          변경 신청
        </Button>
      </form>
    </>
  );
}
