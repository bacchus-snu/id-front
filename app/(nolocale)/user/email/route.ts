import { apiUrl } from '@/api';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const resp = await fetch(apiUrl('/api/user/email'), {
    method: 'DELETE',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    return NextResponse.json(data, { status: resp.status });
  }
  return new Response(null, { status: 200 });
}
