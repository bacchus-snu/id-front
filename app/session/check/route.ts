import { NextResponse } from 'next/server';

import { checkLogin } from '@/api';

export async function GET(): Promise<Response> {
  return NextResponse.json(await checkLogin());
}
