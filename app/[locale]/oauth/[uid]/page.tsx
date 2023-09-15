import { getInteractionDetails } from '@/api/oauth';
import SignIn from '@/components/SignIn';
import { Locale } from '@/locale';

import OAuthConsent from './OAuthConsent';

type Props = {
  params: {
    locale: Locale;
    uid: string;
  };
};

export default async function OAuthPage({
  params: { uid, locale },
}: Props) {
  const interactionDetails = await getInteractionDetails(uid);

  if (interactionDetails.prompt.name === 'login') {
    return <SignIn locale={locale} oauthUid={uid} />;
  }

  if (interactionDetails.prompt.name === 'consent') {
    const details = interactionDetails.prompt.details;
    return <OAuthConsent details={details} />;
  }

  return null;
}
