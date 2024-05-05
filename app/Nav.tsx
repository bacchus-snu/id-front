'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';

import fetcher from '@/api/fetcher';
import useLocaleDict from '@/components/LocaleDict';

export default function Nav() {
  const pathname = usePathname();
  const isOAuth = pathname.startsWith('/oauth');
  const { data } = useSWR(isOAuth ? null : '/session/check', fetcher);
  const { dict } = useLocaleDict();

  return (
    <div className="h-16 flex-none bg-primary-300 dark:bg-primary-700">
      <nav className="h-full max-w-screen-lg flex flex-row items-center mx-auto px-4">
        <h1 className="text-xl">
          <Link href="/">SNUCSE ID</Link>
        </h1>
        <div className="flex-1" />
        {data?.signedIn && (
          <div className="flex flex-row items-center space-x-2">
            <span>{data.username}</span>
            <div className="bg-black/50 dark:bg-white/75 w-[1px] h-4" />
            <Link href="/signout" prefetch={false}>{dict.links.signOut}</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
