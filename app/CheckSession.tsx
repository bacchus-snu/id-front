'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import fetcher from './fetcher';

export default function CheckSession() {
  const { error } = useSWR('/api/check-login', fetcher, { shouldRetryOnError: false });
  const router = useRouter();
  const notLoggedIn = Boolean(error)

  useEffect(() => {
    router.refresh();
  }, [notLoggedIn]);

  return null;
}
