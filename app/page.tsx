import { checkLogin } from './api';

export default async function Home() {
  const loginInfo = await checkLogin();
  return (
    <p>
      {loginInfo.loggedIn ? loginInfo.username : '로그인되지 않음'}
    </p>
  );
}
