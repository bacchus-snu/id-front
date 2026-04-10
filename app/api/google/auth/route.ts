import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiUrl } from '@/api';

export async function GET(): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl('/api/google/auth'), {
    headers: { cookie },
    redirect: 'manual',
  });

  const location = resp.headers.get('location');
  if (!location) {
    return new Response(null, { status: resp.status });
  }

  const response = NextResponse.redirect(location);

  // Forward Set-Cookie headers from backend (state cookie)
  const setCookies = resp.headers.getSetCookie();
  for (const c of setCookies) {
    response.headers.append('Set-Cookie', c);
  }

  return response;
}
