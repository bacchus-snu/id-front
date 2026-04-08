import { apiUrl } from '@/api';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  const body = await request.json();
  const resp = await fetch(apiUrl('/api/canvas/apply'), {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
