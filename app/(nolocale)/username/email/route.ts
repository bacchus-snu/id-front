import { NextResponse } from 'next/server';
import * as z from 'zod';

import { apiUrl } from '@/api';
import { getDictionary, getLocaleFromCookie } from '@/locale';

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

  const locale = getLocaleFromCookie();
  const dict = await getDictionary(locale);

  const [local, domain] = body.email.split('@', 2);

  const resp = await fetch(apiUrl('/api/user/send-username'), {
    method: 'post',
    body: JSON.stringify({ emailLocal: local, emailDomain: domain }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (resp.status === 429) {
    return NextResponse.json(
      { message: dict.error.emailLimitExceeded },
      { status: 409 },
    );
  }
  if (!resp.ok) {
    return NextResponse.json(
      { message: dict.error.emailFailed },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
