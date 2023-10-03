'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { ConsentDetails, OAuthClient } from '@/api/oauth';
import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

const hiddenClaims = new Set(['sub', 'sid', 'auth_time', 'acr', 'amr', 'iss']);

type Props = {
  details: ConsentDetails;
  client?: OAuthClient;
  grantedScope?: string[];
};

export default function OAuthConsent({ details, client, grantedScope }: Props) {
  const { uid } = useParams();
  const router = useRouter();
  const { dict } = useLocaleDict();

  const [requestPending, setRequestPending] = useState(false);
  const showToast = useToast();

  async function handleClickConfirm() {
    try {
      setRequestPending(true);
      const resp = await fetch(`/oauth/${uid}/action/confirm`, {
        method: 'post',
        credentials: 'same-origin',
      });

      if (!resp.ok) {
        showToast({
          type: 'error',
          message: dict.error.consentConfirmFailed,
        });
        setRequestPending(false);
        return;
      }

      const redirectTo: string = (await resp.json()).redirectTo;
      const redirectUrl = new URL(redirectTo, window.location.href);
      if (redirectUrl.host === window.location.host && redirectUrl.pathname.startsWith('/oauth/')) {
        router.replace(redirectUrl.href);
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

  async function handleClickAbort() {
    try {
      setRequestPending(true);
      const resp = await fetch(`/oauth/${uid}/action/abort`, {
        method: 'get',
        credentials: 'same-origin',
      });

      if (!resp.ok) {
        showToast({
          type: 'error',
          message: dict.error.consentAbortFailed,
        });
        setRequestPending(false);
        return;
      }

      const redirectTo: string = (await resp.json()).redirectTo;
      const redirectUrl = new URL(redirectTo, window.location.href);
      if (redirectUrl.host === window.location.host && redirectUrl.pathname.startsWith('/oauth/')) {
        router.replace(redirectUrl.href);
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

  const isEmptyConsent = !details.missingOIDCScope && !details.missingOIDCClaims
    && !details.missingResourceScopes;
  const titleTemplate: React.ReactNode[] =
    (isEmptyConsent ? dict.oidc.consentEmpty : dict.oidc.consent).split('{}');
  if (client?.name) {
    titleTemplate.splice(
      1,
      0,
      <strong key="title" className="font-bold">{client.name}</strong>,
    );
  }

  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.consent}</h2>
      <p>{titleTemplate}</p>
      {!isEmptyConsent && (
        <ul>
          {details.missingOIDCScope?.map(v => (
            <li key={v}>
              {(dict.oidc.scopes as Record<string, string>)[v] ?? v}
            </li>
          ))}
          {details.missingOIDCClaims?.filter(v => !hiddenClaims.has(v)).map(v => (
            <li key={v}>
              {(dict.oidc.claims as Record<string, string>)[v] ?? v}
            </li>
          ))}
        </ul>
      )}
      {details.missingResourceScopes && (
        <>
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
        </>
      )}
      {grantedScope && grantedScope.length > 0 && (
        <>
          <p>{dict.oidc.grantedList}</p>
          <ul>
            {grantedScope.map(v => (
              <li key={v}>
                {(dict.oidc.claims as Record<string, string>)[v] ?? v}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="flex flex-row-reverse gap-2">
        <Button
          className="flex-0 w-24 font-bold"
          color="primary"
          disabled={requestPending}
          onClick={handleClickConfirm}
        >
          {dict.oidc.buttonConfirm}
        </Button>
        <Button
          className="flex-0 w-24 font-bold"
          color="accent"
          disabled={requestPending}
          onClick={handleClickAbort}
        >
          {dict.oidc.buttonAbort}
        </Button>
      </div>
    </section>
  );
}
