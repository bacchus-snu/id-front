'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { mutate } from 'swr';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await fetch('/api/logout');
      mutate('/api/check-login');
      router.push('/');
      // https://github.com/vercel/next.js/issues/42991
      router.refresh();
    })();
  });

  return null;
}
