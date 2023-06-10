import { checkLogin } from '@/api';

export default async function AuthorizedLayout({
  children,
  login,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
}) {
  const loginResp = await checkLogin();
  return <>{loginResp.loggedIn ? children : login}</>;
}
