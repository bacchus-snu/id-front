import { redirect } from 'next/navigation';

import { checkLogin } from '../api';

export default async function Login() {
  const loginInfo = await checkLogin();
  if (loginInfo.loggedIn) {
    redirect('/');
  }

  return null;
}
