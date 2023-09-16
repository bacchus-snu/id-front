import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import SignIn from '@/components/SignIn';
import { getDictionary, Locale } from '@/locale';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.signIn,
  };
}

export default async function Login({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    redirect('/');
  }

  return <SignIn locale={locale} />;
}
