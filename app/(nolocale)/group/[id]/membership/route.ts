import { NextResponse } from 'next/server';
import * as z from 'zod';

import {
  acceptPendingGroupMembers,
  applyToGroup,
  BadRequestError,
  ForbiddenError,
  leaveGroup,
  rejectOrRemoveGroupMembers,
} from '@/api';
import { getDictionary, getLocaleFromCookie } from '@/locale';

const bodySchema = z.intersection(
  z.object({ action: z.union([z.literal('add'), z.literal('remove')]) }),
  z.union([
    z.object({ self: z.literal(true) }),
    z.object({ self: z.optional(z.literal(false)), uid: z.array(z.number()) }),
  ]),
);
type Params = { id: string };

export async function POST(
  request: Request,
  { params }: { params: Params },
): Promise<Response> {
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
    if (body.action === 'add') {
      if (body.self) {
        await applyToGroup(params.id);
      } else {
        const uid = body.uid;
        await acceptPendingGroupMembers(params.id, uid);
      }
    } else {
      if (body.self) {
        await leaveGroup(params.id);
      } else {
        const uid = body.uid;
        await rejectOrRemoveGroupMembers(params.id, uid);
      }
    }
  } catch (e) {
    const locale = getLocaleFromCookie();
    const dict = await getDictionary(locale);

    if (e instanceof BadRequestError) {
      return NextResponse.json(
        { message: e.toString() },
        { status: 400 },
      );
    }
    if (e instanceof ForbiddenError) {
      return NextResponse.json(
        { message: e.toString() },
        { status: 401 },
      );
    }
    console.error(e);
    return NextResponse.json(
      { message: dict.error.unknown },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
