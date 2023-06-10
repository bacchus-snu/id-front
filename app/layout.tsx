import './globals.css';
import localFont from 'next/font/local';

import CheckSession from './CheckSession';
import Nav from './Nav';
import NotificationProvider from './NotificationContext';

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={'bg-slate-50 text-black dark:bg-slate-900 dark:text-white '
          + 'flex flex-col items-stretch min-h-screen '
          + pretendard.className}
      >
        <NotificationProvider>
          <CheckSession />
          <Nav />
          <main className="w-full max-w-screen-md self-center flex-1 flex flex-col items-stretch px-8 py-16">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
