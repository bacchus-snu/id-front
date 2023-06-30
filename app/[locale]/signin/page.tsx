import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import { Locale, getDictionary } from '@/locale';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale },
}): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.signIn,
  };
}

export default async function Login() {
  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    redirect('/');
  }

  return null;
}
