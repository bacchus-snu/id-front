import { NextResponse } from 'next/server';

import { ForbiddenError, rejectOrRemoveGroupMembers } from '@/app/api';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const uid = await request.json();
  try {
    await rejectOrRemoveGroupMembers(params.id, uid);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return NextResponse.json(
        { message: e.toString() },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { message: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
  return new Response(null, { status: 204 });
}
