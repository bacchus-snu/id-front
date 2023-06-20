import { Metadata } from 'next';

import { checkSession } from '@/api';

type Props = {
  children: React.ReactNode;
  signin: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    return {};
  }
  return {
    title: {
      template: '로그인 | Bacchus ID',
      absolute: '로그인 | Bacchus ID',
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
