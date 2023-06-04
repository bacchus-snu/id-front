import { redirect } from 'next/navigation';

import { checkLogin } from './api';

export default async function Home() {
  const loginInfo = await checkLogin();
  if (!loginInfo.loggedIn) {
    redirect('/login');
  }

  return (
    <p>
      {loginInfo.username}
    </p>
  );
}
