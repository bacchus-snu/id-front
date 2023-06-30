import { NextResponse } from 'next/server';

import { checkSession } from '@/api';

export async function GET(): Promise<Response> {
  return NextResponse.json(await checkSession());
}
