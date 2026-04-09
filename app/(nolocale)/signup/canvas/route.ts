import { apiUrl } from '@/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const resp = await fetch(apiUrl('/api/user/canvas-signup'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json().catch(() => ({}));
  return NextResponse.json(data, { status: resp.status });
}
