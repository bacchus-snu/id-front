import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiUrl } from '@/api';

export async function GET(request: NextRequest): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  const search = request.nextUrl.search;

  const resp = await fetch(apiUrl(`/api/google/callback${search}`), {
    headers: { cookie },
    redirect: 'manual',
  });

  const location = resp.headers.get('location');
  if (!location) {
    return new Response(null, { status: resp.status });
  }

  const response = NextResponse.redirect(location, 302);

  // Forward Set-Cookie headers from backend (clear state cookie)
  const setCookies = resp.headers.getSetCookie();
  for (const c of setCookies) {
    response.headers.append('Set-Cookie', c);
  }

  return response;
}
