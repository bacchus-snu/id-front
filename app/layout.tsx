import './globals.css';
import localFont from 'next/font/local';

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
      <body className={"flex flex-col min-h-screen " + pretendard.className}>
        <nav className="flex-none flex flex-row p-4 bg-orange-800">
          <h1 className="text-xl">Bacchus ID</h1>
        </nav>
        <main className="md:container md:mx-auto flex-1 flex flex-col items-center p-16">
          {children}
        </main>
      </body>
    </html>
  );
}
