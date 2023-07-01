'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { ConsentDetails } from '@/api/oauth';
import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

type Props = {
  details: ConsentDetails;
};

export default function OAuthConsent({ details }: Props) {
  const { uid } = useParams();
  const { dict } = useLocaleDict();

  const [requestPending, setRequestPending] = useState(false);
  const showToast = useToast();

  async function handleClickConfirm() {
    try {
      setRequestPending(true);
      const resp = await fetch(`/oauth/${uid}/confirm`, {
        method: 'post',
        credentials: 'same-origin',
      });

      if (!resp.ok) {
        showToast({
          type: 'error',
          message: '승인에 실패했습니다.',
        });
        setRequestPending(false);
        return;
      }

      const redirectTo: string = (await resp.json()).redirectTo;
      const redirectUrl = new URL(redirectTo, window.location.href);
      window.location.href = redirectUrl.href;
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        message: dict.error.unknown,
      });
      setRequestPending(false);
    }
  }

  async function handleClickAbort() {
    try {
      setRequestPending(true);
      const resp = await fetch(`/oauth/${uid}/abort`, {
        method: 'get',
        credentials: 'same-origin',
      });

      if (!resp.ok) {
        showToast({
          type: 'error',
          message: '처리에 실패했습니다.',
        });
        setRequestPending(false);
        return;
      }

      const redirectTo: string = (await resp.json()).redirectTo;
      const redirectUrl = new URL(redirectTo, window.location.href);
      window.location.href = redirectUrl.href;
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        message: dict.error.unknown,
      });
      setRequestPending(false);
    }
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">권한 요청</h2>
      {details.missingOIDCScope && (
        <p>
          <strong className="font-bold">
            <code>missingOIDCScope</code>
          </strong>
          <ul>
            {details.missingOIDCScope.map(v => <li key={v}>{v}</li>)}
          </ul>
        </p>
      )}
      {details.missingOIDCClaims && (
        <p>
          <strong className="font-bold">
            <code>missingOIDCClaims</code>
          </strong>
          <ul>
            {details.missingOIDCClaims.map(v => <li key={v}>{v}</li>)}
          </ul>
        </p>
      )}
      {details.missingResourceScopes && (
        <p>
          <strong className="font-bold">
            <code>missingResourceScopes</code>
          </strong>
          <ul>
            {Object.entries(details.missingResourceScopes).map(([resource, scopes]) => (
              <li key={resource}>
                {resource}
                <ul>
                  {scopes.map(scope => <li key={scope}>{scope}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </p>
      )}
      <div className="flex flex-row-reverse">
        <Button
          className="flex-0 w-24 font-bold"
          color="primary"
          disabled={requestPending}
          onClick={handleClickConfirm}
        >
          승인
        </Button>
        <Button
          className="flex-0 w-24 font-bold"
          color="accent"
          disabled={requestPending}
          onClick={handleClickAbort}
        >
          거절
        </Button>
      </div>
    </section>
  );
}
