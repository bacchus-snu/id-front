import { NextResponse } from 'next/server';
import * as z from 'zod';

import { apiUrl } from '@/api';
import mapError from '@/api/mapError';
import { getDictionary, getLocaleFromCookie } from '@/locale';

const bodySchema = z.object({
  token: z.string().nonempty('tokenRequired'),
  username: z.string().regex(/^[a-z][a-z0-9]+$/, 'usernameInvalid'),
  password: z.string().min(8, 'passwordTooShort'),
  name: z.string().nonempty('nameRequired'),
  studentNumbers: z.array(
    z.string().regex(/^\d{4}-\d{4,5}|\d{5}-\d{3}$/, 'studentNumberInvalid'),
  ).nonempty('studentNumberRequired'),
  preferredLanguage: z.union([z.literal('ko'), z.literal('en')]),
});

export async function POST(req: Request): Promise<Response> {
  const locale = getLocaleFromCookie();
  const dict = await getDictionary(locale);

  let body;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.map(error => mapError(error, dict));
      return NextResponse.json(
        { message: e.message, errors },
        { status: 400 },
      );
    }
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
