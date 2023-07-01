'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

import fetcher from '@/api/fetcher';

export default function CheckSession() {
  const pathname = usePathname();
  const isOAuth = pathname.startsWith('/oauth');
  const { data } = useSWR(isOAuth ? null : '/session/check', fetcher);
  const router = useRouter();

  const signedIn = data?.signedIn;
  const prevSignInState = useRef(signedIn);

  useEffect(() => {
    const prev = prevSignInState.current;
    if (prev !== signedIn) {
      prevSignInState.current = signedIn;
      if (prev != null) {
        router.refresh();
      }
    }
  }, [router, signedIn]);

  return null;
}
