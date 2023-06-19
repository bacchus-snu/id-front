import { Metadata } from 'next';

import { checkLogin } from '@/api';

type Props = {
  children: React.ReactNode;
  login: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const loginResp = await checkLogin();
  if (loginResp.loggedIn) {
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
  login,
}: Props) {
  const loginResp = await checkLogin();
  return <>{loginResp.loggedIn ? children : login}</>;
}
