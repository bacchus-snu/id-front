'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

import fetcher from '@/api/fetcher';

export default function CheckSession() {
  const { error } = useSWR('/api/check-login', fetcher, { shouldRetryOnError: false });
  const router = useRouter();

  const loggedIn = !Boolean(error);
  const prevLoginState = useRef(loggedIn);

  useEffect(() => {
    if (prevLoginState.current !== loggedIn) {
      prevLoginState.current = loggedIn;
      router.refresh();
    }
  }, [router, loggedIn]);

  return null;
}
