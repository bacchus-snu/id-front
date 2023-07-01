import { getInteractionDetails } from '@/api/oauth';

import OAuthConsent from './OAuthConsent';
import OAuthSignInForm from './OAuthSignInForm';

type Props = {
  params: { uid: string };
};

export default async function OAuthPage({ params: { uid } }: Props) {
  const interactionDetails = await getInteractionDetails(uid);

  if (interactionDetails.prompt.name === 'login') {
    return <OAuthSignInForm />;
  }

  if (interactionDetails.prompt.name === 'consent') {
    const details = interactionDetails.prompt.details;
    return <OAuthConsent details={details} />;
  }

  return null;
}
