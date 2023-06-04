'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
