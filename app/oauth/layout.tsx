import '../globals.css';

import localFont from 'next/font/local';

import NotificationProvider from '@/components/NotificationContext';

import CheckSession from '../CheckSession';
import Nav from '../Nav';

const pretendard = localFont({
  src: '../pretendard.woff2',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | Bacchus ID',
    default: 'Bacchus ID',
  },
  formatDetection: {
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
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
