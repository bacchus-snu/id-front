import { NextResponse } from 'next/server';
import * as z from 'zod';

import { apiUrl } from '@/api';

const bodySchema = z.object({
  token: z.string().nonempty('토큰이 필요합니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
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

  const resp = await fetch(apiUrl('/api/user/change-password'), {
    method: 'post',
    body: JSON.stringify({ token: body.token, newPassword: body.password }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (resp.status === 401) {
    return NextResponse.json(
      { message: '토큰 확인에 실패했습니다.' },
      { status: 401 },
    );
  }
  if (!resp.ok) {
    return NextResponse.json(
      { message: '비밀번호 변경에 실패했습니다.' },
      { status: 500 },
    );
  }

  return new Response(null, { status: 201 });
}
