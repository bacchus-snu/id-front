import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkLogin } from '@/api';

export const metadata: Metadata = {
  title: '로그인',
};

export default async function Login() {
  const loginInfo = await checkLogin();
  if (loginInfo.loggedIn) {
    redirect('/');
  }

  return null;
}
