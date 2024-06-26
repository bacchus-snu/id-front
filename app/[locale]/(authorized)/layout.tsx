import { Metadata } from 'next';

import { checkSession } from '@/api';
import { getDictionary, Locale } from '@/locale';

type Props = {
  children: React.ReactNode;
  signin: React.ReactNode;
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
  signin: React.ReactNode;
}): Promise<Metadata> {
  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    return {};
  }

  const dict = await getDictionary(locale);
  return {
    title: {
      template: `${dict.title.signIn} | SNUCSE ID`,
      absolute: `${dict.title.signIn} | SNUCSE ID`,
    },
  };
}

export default async function AuthorizedLayout({
  children,
  signin,
}: Props) {
  const sessionInfo = await checkSession();
  return <>{sessionInfo.signedIn ? children : signin}</>;
}
