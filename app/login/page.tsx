import { redirect } from 'next/navigation';

import { checkLogin } from '../api';
import LoginForm from './LoginForm';

export default async function Login() {
  const loginInfo = await checkLogin();
  if (loginInfo.loggedIn) {
    redirect('/');
  }

  return <LoginForm />;
}
