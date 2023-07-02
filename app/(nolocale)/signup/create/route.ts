import { apiUrl } from '@/api';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const bodySchema = z.object({
  token: z.string().nonempty('토큰이 필요합니다.'),
  username: z.string().regex(/^[a-z][a-z0-9]+$/, '유저명 형식이 잘못되었습니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  name: z.string().nonempty('이름은 비워둘 수 없습니다.'),
  studentNumbers: z.array(
    z.string().regex(/^\d{4}-\d{4,5}|\d{5}-\d{3}$/, '잘못된 학번입니다.'),
  ).nonempty('학번은 비워둘 수 없습니다.'),
  preferredLanguage: z.union([z.literal('ko'), z.literal('en')]),
});

export async function POST(req: Request): Promise<Response> {
  let body;
  try {
    body = bodySchema.parse(await req.json());
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

  const resp = await fetch(apiUrl('/api/user'), {
    method: 'post',
    body: JSON.stringify(body),
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
  if (resp.status === 409) {
    return NextResponse.json(
      { message: '유저가 이미 존재합니다.' },
      { status: 409 },
    );
  }
  if (!resp.ok) {
    return NextResponse.json(
      { message: '유저 생성에 실패했습니다.' },
      { status: 500 },
    );
  }

  return new Response(null, { status: 201 });
}
