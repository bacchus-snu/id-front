import { redirect, RedirectType } from 'next/navigation';

import { getInteractionDetails } from '@/api/oauth';

import OAuthConsent from './OAuthConsent';

type Props = {
  params: Promise<{
    uid: string;
  }>;
};

export default async function OAuthPage(props: Props) {
  const params = await props.params;

  const {
    uid,
  } = params;

  const interactionDetails = await getInteractionDetails(uid);

  if (interactionDetails.prompt.name === 'login') {
    redirect(`/signin?uid=${encodeURIComponent(uid)}`, RedirectType.replace);
  }

  if (interactionDetails.prompt.name === 'consent') {
    const details = interactionDetails.prompt.details;
    const client = interactionDetails.client;
    let grantedScope = interactionDetails.params.scope;
    if (typeof grantedScope === 'string') {
      grantedScope = grantedScope.split(' ').filter(x => Boolean(x));
    }
    return <OAuthConsent details={details} client={client} grantedScope={grantedScope} />;
  }

  return null;
}
