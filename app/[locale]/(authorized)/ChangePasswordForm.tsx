'use client';

import { useState } from 'react';

import type { Email } from '@/api';
import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
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
  const { dict } = useLocaleDict();
  const formDict = dict.changePassword.signedInForm;
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
        message: dict.error.unknown,
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
        {dict.changePassword.signedInForm.emailSentDescription.map((desc, index) => (
          // FIXME: 좀 더 제대로 된 i18n 라이브러리 써서 교체하기
          <p key={index} dangerouslySetInnerHTML={{ __html: desc }} />
        ))}
      </>
    );
  }

  let emailOptions;
  if (emails == null) {
    emailOptions = <option value="0">{formDict.emailLoading}</option>;
  } else {
    emailOptions = emails.map(({ local, domain }, idx) => (
      <option key={`${local}@${domain}`} value={String(idx)}>
        {local}@{domain}
      </option>
    ));
  }

  return (
    <>
      <p>{formDict.description}</p>
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
          {formDict.buttonSendEmail}
        </Button>
      </form>
    </>
  );
}
