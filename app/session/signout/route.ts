import { headers } from 'next/headers';

import { apiUrl } from '@/api';

export function POST(): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  return fetch(apiUrl('/api/logout'), {
    method: 'post',
    headers: { cookie },
  });
}
