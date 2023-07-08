import { NextResponse } from 'next/server';
import * as z from 'zod';

import { apiUrl } from '@/api';
import mapError from '@/api/mapError';
import { getDictionary, getLocaleFromCookie } from '@/locale';

const bodySchema = z.object({
  token: z.string().nonempty('tokenRequired'),
  password: z.string().min(8, 'passwordTooShort'),
});

export async function POST(request: Request): Promise<Response> {
  const locale = getLocaleFromCookie();
  const dict = await getDictionary(locale);

  let body;
  try {
    body = bodySchema.parse(await request.json());
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

  const resp = await fetch(apiUrl('/api/user/change-password'), {
    method: 'post',
    body: JSON.stringify({ token: body.token, newPassword: body.password }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (resp.status === 401) {
    return NextResponse.json(
      { message: dict.error.tokenVerificationFailed },
      { status: 401 },
    );
  }
  if (!resp.ok) {
    return NextResponse.json(
      { message: dict.error.changePasswordFailed },
      { status: 500 },
    );
  }

  return new Response(null, { status: 201 });
}
