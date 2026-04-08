import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import * as z from 'zod';

import { addStudentNumber, apiUrl, BadRequestError, DuplicateError, ForbiddenError } from '@/api';
import { getDictionary, getLocaleFromCookie } from '@/locale';

const bodySchema = z.object({
  studentNumber: z.string(),
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

  try {
    await addStudentNumber(body.studentNumber);
  } catch (e) {
    const locale = getLocaleFromCookie();
    const dict = await getDictionary(locale);

    if (e instanceof ForbiddenError) {
      return NextResponse.json(
        { message: 'Please sign in again' },
        { status: 401 },
      );
    }
    if (e instanceof DuplicateError) {
      return NextResponse.json(
        { message: dict.studentId.errorDuplicate },
        { status: 409 },
      );
    }
    if (e instanceof BadRequestError) {
      return NextResponse.json(
        { message: dict.studentId.errorInvalidFormat },
        { status: 400 },
      );
    }
    console.error(e);
    return NextResponse.json(
      { message: dict.error.unknown },
      { status: 500 },
    );
  }

  return new Response(null, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const cookie = headers().get('cookie') || '';
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }
  const resp = await fetch(apiUrl('/api/user/student-numbers'), {
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
