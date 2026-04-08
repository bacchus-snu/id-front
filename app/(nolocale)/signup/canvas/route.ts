import { apiUrl } from '@/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const resp = await fetch(apiUrl('/api/user/canvas-signup'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
