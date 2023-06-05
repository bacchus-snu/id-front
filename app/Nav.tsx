'use client';

import Link from 'next/link';
import useSWR from 'swr';

import fetcher from './fetcher';

export default function Nav() {
  const { data, error } = useSWR('/api/check-login', fetcher, { shouldRetryOnError: false });

  return (
    <nav className="flex-none flex flex-row items-center p-4 bg-primary-300 dark:bg-primary-700">
      <h1 className="text-xl">Bacchus ID</h1>
      <div className="flex-1" />
      {!error && data && (
        <div className="flex flex-row items-center space-x-2">
          <span>{data.username}</span>
          <div className="bg-black/50 dark:bg-white/75 w-[1px] h-4" />
          <Link href="/logout" prefetch={false}>로그아웃</Link>
        </div>
      )}
    </nav>
  );
}
