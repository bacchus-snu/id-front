import { getInteractionDetails } from '@/api/oauth';
import { LocaleDictProvider } from '@/components/LocaleDict';
import { getDictionary, Locale } from '@/locale';

import OAuthConsent from './OAuthConsent';
import OAuthSignInForm from './OAuthSignInForm';

type Props = {
  params: { uid: string };
  searchParams: { locale?: Locale };
};

export default async function OAuthPage({
  params: { uid },
  searchParams: { locale = 'ko' },
}: Props) {
  const dict = await getDictionary(locale);
  const interactionDetails = await getInteractionDetails(uid);

  let body;

  if (interactionDetails.prompt.name === 'login') {
    body = <OAuthSignInForm />;
  } else if (interactionDetails.prompt.name === 'consent') {
    const details = interactionDetails.prompt.details;
    body = <OAuthConsent details={details} />;
  }

  return (
    <LocaleDictProvider locale={locale} dict={dict}>
      {body}
    </LocaleDictProvider>
  );
}
