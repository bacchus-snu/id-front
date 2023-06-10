import { redirect } from 'next/navigation';

import { checkLogin } from '@/api';

import ChangePassword from './ChangePassword';
import Groups from './Groups';

export default async function Home() {
  const loginInfo = await checkLogin();
  if (!loginInfo.loggedIn) {
    redirect('/login');
  }

  return (
    <section className="space-y-4">
      <p className="text-center">{loginInfo.username}님, 환영합니다.</p>
      <Groups />
      <ChangePassword />
    </section>
  );
}
