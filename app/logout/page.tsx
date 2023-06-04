'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await fetch('/api/logout');
      router.push('/');
    })();
  });

  return null;
}
