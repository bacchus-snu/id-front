import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';

export const metadata: Metadata = {
  title: '로그인',
};

export default async function Login() {
  const sessionInfo = await checkSession();
  if (sessionInfo.signedIn) {
    redirect('/');
  }

  return null;
}
