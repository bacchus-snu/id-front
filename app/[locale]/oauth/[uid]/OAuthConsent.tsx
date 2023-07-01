'use client';

import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { dict } = useLocaleDict();

  const [requestPending, setRequestPending] = useState(false);
  const showToast = useToast();

  async function handleClickConfirm() {
    try {
      setRequestPending(true);
      const resp = await fetch(`/api/interaction/${uid}/consent`, {
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
      if (redirectUrl.host === window.location.host) {
        router.replace(redirectUrl.pathname + redirectUrl.search);
        router.refresh();
      } else {
        window.location.href = redirectUrl.href;
      }
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
      <Button
        className="font-bold"
        color="primary"
        disabled={requestPending}
        onClick={handleClickConfirm}
      >
        승인
      </Button>
    </section>
  );
}
