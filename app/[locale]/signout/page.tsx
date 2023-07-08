'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { revalidateSession } from '@/api/session';
import useLocaleDict from '@/components/LocaleDict';

export default function Logout() {
  const { dict } = useLocaleDict();
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

  return <p className="text-center">{dict.signOut.message}</p>;
}
