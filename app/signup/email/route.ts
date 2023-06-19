import { NextResponse } from 'next/server';
import * as z from 'zod';

import { BadRequestError, signupSendEmail } from '@/api';

const bodySchema = z.object({
  email: z.string(),
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

  try {
    await signupSendEmail({ emailLocal: local, emailDomain: domain });
  } catch (e) {
    if (e instanceof BadRequestError) {
      return NextResponse.json(
        { message: e.message },
        { status: 400 },
      );
    }

    console.error(e);
    return NextResponse.json(
      { message: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
