import './globals.css';
import localFont from 'next/font/local';

import { checkLogin } from './api';
import CheckSession from './CheckSession';
import Nav from './Nav';

const pretendard = localFont({
  src: './pretendard.woff2',
  display: 'swap',
});

export const metadata = {
  title: 'Bacchus ID',
  description: 'Bacchus ID',
};

export default async function RootLayout({
  children,
  login,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
}) {
  const loginResp = await checkLogin();

  return (
    <html lang="ko">
      <body
        className={'bg-slate-50 text-black dark:bg-slate-900 dark:text-white '
          + 'flex flex-col items-stretch min-h-screen '
          + pretendard.className}
      >
        <CheckSession />
        <Nav />
        <main className="w-full max-w-screen-md self-center flex-1 flex flex-col items-stretch px-8 py-16">
          {loginResp.loggedIn ? children : login}
        </main>
      </body>
    </html>
  );
}
