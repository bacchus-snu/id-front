'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { revalidateSession } from '../login';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await fetch('/api/logout');
      revalidateSession();
      router.push('/');
      // https://github.com/vercel/next.js/issues/42991
      router.refresh();
    })();
  });

  return null;
}
