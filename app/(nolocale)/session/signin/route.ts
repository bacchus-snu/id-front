import { headers } from 'next/headers';

import { apiUrl } from '@/api';

export async function POST(request: Request): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  const body = await request.arrayBuffer();
  return fetch(apiUrl('/api/login'), {
    method: 'post',
    body,
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json',
      cookie,
    },
  });
}
