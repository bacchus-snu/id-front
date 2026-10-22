import { headers } from 'next/headers';

import { apiUrl } from '@/api';

export async function POST(): Promise<Response> {
  const cookie = (await headers()).get('cookie') || '';
  return fetch(apiUrl('/api/logout'), {
    method: 'post',
    headers: { cookie },
  });
}
