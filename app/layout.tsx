import './globals.css';
import localFont from 'next/font/local';

import Nav from './Nav';

const pretendard = localFont({
  src: './pretendard.woff2',
  display: 'swap',
});

export const metadata = {
  title: 'Bacchus ID',
  description: 'Bacchus ID',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={'dark:bg-black dark:text-white flex flex-col min-h-screen ' + pretendard.className}>
        <Nav />
        <main className="max-w-screen-md self-center flex-1 flex flex-col items-stretch p-16">
          {children}
        </main>
      </body>
    </html>
  );
}
