import { getInteractionDetails } from '@/api/oauth';

import ClientRedirect from '@/components/ClientRedirect';
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
    return <ClientRedirect to={`/signin?uid=${encodeURIComponent(uid)}`} />;
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
