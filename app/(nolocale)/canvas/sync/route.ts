import { apiUrl } from '@/api';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const resp = await fetch(apiUrl('/api/canvas/sync'), {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
