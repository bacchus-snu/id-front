import { NextResponse } from 'next/server';
import * as z from 'zod';

import { apiUrl } from '@/api';

const bodySchema = z.object({
  email: z.string().email(),
});
export async function POST(request: Request): Promise<Response> {
  let body;
  try {
    body = bodySchema.parse(await request.json());
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: e.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: String(e) },
      { status: 400 },
    );
  }

  const [local, domain] = body.email.split('@', 2);
  if (domain !== 'snu.ac.kr') {
    return NextResponse.json(
      { message: '사용할 수 없는 이메일입니다.' },
      { status: 400 },
    );
  }

  const resp = await fetch(apiUrl('/api/email/verify'), {
    method: 'post',
    body: JSON.stringify({ emailLocal: local, emailDomain: domain }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (resp.status === 409) {
    return NextResponse.json(
      { message: '사용할 수 없는 이메일입니다.' },
      { status: 409 },
    );
  }
  if (resp.status === 429) {
    return NextResponse.json(
      { message: '더 이상 메일을 전송할 수 없습니다.' },
      { status: 409 },
    );
  }
  if (!resp.ok) {
    return NextResponse.json(
      { message: '메일 전송에 실패했습니다.' },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
