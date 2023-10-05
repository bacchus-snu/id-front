import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import { getInteractionDetails } from '@/api/oauth';

import OAuthConsent from './OAuthConsent';

type Props = {
  params: {
    uid: string;
  };
};

export default async function OAuthPage({
  params: { uid },
}: Props) {
  const interactionDetails = await getInteractionDetails(uid);

  if (interactionDetails.prompt.name === 'login') {
    redirect(`/signin?uid=${encodeURIComponent(uid)}`, RedirectType.replace);
  }

  if (interactionDetails.prompt.name === 'consent') {
    const details = interactionDetails.prompt.details;
    const client = interactionDetails.client;
    const grantedScope = interactionDetails.params.scope;
    return <OAuthConsent details={details} client={client} grantedScope={grantedScope} />;
  }

  return null;
}
