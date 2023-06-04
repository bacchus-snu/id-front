import { headers } from 'next/headers';
import * as z from 'zod';

export function apiUrl(ep: string): URL {
  return new URL(ep, process.env.API_BASE);
}

const checkLoginSchema = z.object({
  username: z.string(),
});
export type CheckLoginResult = { loggedIn: false } | { loggedIn: true; username: string };
export async function checkLogin(): Promise<CheckLoginResult> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl('/api/check-login'), {
    headers: { cookie },
  });
  if (!resp.ok) {
    return { loggedIn: false };
  }

  const body = checkLoginSchema.parse(await resp.json());
  return {
    loggedIn: true,
    username: body.username,
  };
}
