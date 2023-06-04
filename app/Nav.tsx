'use client';

import Link from 'next/link';
import useSWR from 'swr';

import fetcher from './fetcher';

export default function Nav() {
  const { data, error } = useSWR('/api/check-login', fetcher, { shouldRetryOnError: false });
  return (
    <nav className="flex-none flex flex-row items-center p-4 bg-orange-800">
      <h1 className="text-xl">Bacchus ID</h1>
      <div className="flex-1" />
      {!error && data && (
        <>
          <span>{data.username}</span>
          <Link href="/logout" prefetch={false}>로그아웃</Link>
        </>
      )}
    </nav>
  );
}
