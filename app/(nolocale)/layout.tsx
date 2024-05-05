import '../globals.css';

import localFont from 'next/font/local';

import { LocaleDictProvider } from '@/components/LocaleDict';
import NotificationProvider from '@/components/NotificationContext';
import { getDictionary, getLocaleFromCookie } from '@/locale';

import CheckSession from '../CheckSession';
import Nav from '../Nav';

const pretendard = localFont({
  src: '../pretendard.woff2',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | SNUCSE ID',
    default: 'SNUCSE ID',
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
  const locale = getLocaleFromCookie();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale}>
      <body
        className={'bg-slate-50 text-black dark:bg-slate-900 dark:text-white '
          + 'flex flex-col items-stretch min-h-screen '
          + pretendard.className}
      >
        <NotificationProvider>
          <LocaleDictProvider locale={locale} dict={dict}>
            <CheckSession />
            <Nav />
            <main className="w-full max-w-screen-md self-center flex-1 flex flex-col items-stretch px-8 py-16">
              {children}
            </main>
          </LocaleDictProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
