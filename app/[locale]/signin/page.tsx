import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import SignIn from '@/components/SignIn';
import { getDictionary, Locale } from '@/locale';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>;
  },
): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  return {
    title: dict.title.signIn,
  };
}

export default async function Login(
  props: {
    params: Promise<{ locale: Locale }>;
  },
) {
  const params = await props.params;

  const {
    locale,
  } = params;

  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    redirect('/');
  }

  return <SignIn locale={locale} />;
}
