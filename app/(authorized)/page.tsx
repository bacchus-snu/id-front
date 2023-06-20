import { redirect } from 'next/navigation';

import { checkSession } from '@/api';

import ChangePassword from './ChangePassword';
import Groups from './Groups';

export default async function Home() {
  const sessionInfo = await checkSession();
  if (!sessionInfo.signedIn) {
    redirect('/signin');
  }

  return (
    <section className="space-y-4">
      <p className="text-center">{sessionInfo.username}님, 환영합니다.</p>
      <Groups />
      <ChangePassword />
    </section>
  );
}
