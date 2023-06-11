'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

import fetcher from '@/api/fetcher';

export default function CheckSession() {
  const { data } = useSWR('/session/check', fetcher);
  const router = useRouter();

  const loggedIn = data?.loggedIn;
  const prevLoginState = useRef(loggedIn);

  useEffect(() => {
    const prev = prevLoginState.current;
    if (prev !== loggedIn) {
      prevLoginState.current = loggedIn;
      if (prev != null) {
        router.refresh();
      }
    }
  }, [router, loggedIn]);

  return null;
}
