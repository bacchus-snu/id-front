'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { revalidateSession } from '@/api/login';

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await fetch('/session/signout', { method: 'post' });
      revalidateSession();
      router.push('/');
      // https://github.com/vercel/next.js/issues/42991
      router.refresh();
    })();
  });

  return <p className="text-center">로그아웃 중...</p>;
}
