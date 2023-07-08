import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import * as z from 'zod';

import { getLocaleFromCookie } from '@/locale';

export function apiUrl(ep: string): URL {
  return new URL(ep, process.env.API_BASE);
}

const checkSessionSchema = z.object({
  username: z.string(),
});
export type CheckSessionResult = { signedIn: false } | { signedIn: true; username: string };
export async function checkSession(): Promise<CheckSessionResult> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl('/api/check-login'), {
    headers: { cookie },
  });
  if (!resp.ok) {
    return { signedIn: false };
  }

  const body = checkSessionSchema.parse(await resp.json());
  return {
    signedIn: true,
    username: body.username,
  };
}

const listGroupsSchema = z.array(
  z.object({
    idx: z.number(),
    name: z.record(z.string()),
    description: z.record(z.string()),
    isPending: z.boolean(),
    isMember: z.boolean(),
    isDirectMember: z.boolean(),
    isOwner: z.boolean(),
  }),
);
export type Group = {
  idx: number;
  name: string;
  description: string;
  pending: boolean;
  joined: boolean;
  implied: boolean;
  owner: boolean;
};
export async function listGroups(): Promise<Group[]> {
  const cookie = headers().get('cookie') || '';
  let locale = getLocaleFromCookie();
  if (locale !== 'ko' && locale !== 'en') {
    locale = 'en';
  }

  const resp = await fetch(apiUrl('/api/group'), {
    headers: { cookie },
  });
  if (!resp.ok) {
    throw new Error('그룹 목록을 가져오는 데 실패했습니다.');
  }

  const body = listGroupsSchema.parse(await resp.json());
  return body.map(value => ({
    idx: value.idx,
    name: value.name[locale] ?? '',
    description: value.description[locale] ?? '',
    pending: value.isPending,
    joined: value.isDirectMember,
    implied: value.isMember,
    owner: value.isOwner,
  }));
}

const emailSchema = z.object({
  local: z.string(),
  domain: z.string(),
});
const listUserEmailsSchema = z.object({
  emails: z.array(emailSchema),
});
export type Email = z.infer<typeof emailSchema>;
export async function listUserEmails(): Promise<Email[]> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl('/api/user/emails'), {
    headers: { cookie },
  });
  if (!resp.ok) {
    throw new Error('이메일 목록을 가져오는 데 실패했습니다.');
  }

  const body = listUserEmailsSchema.parse(await resp.json());
  return body.emails;
}

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export async function applyToGroup(groupIdx: string): Promise<void> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/apply`), {
    method: 'post',
    headers: { cookie },
  });
  if (resp.status === 400) {
    throw new BadRequestError('잘못된 요청입니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 가입 신청에 실패했습니다.');
  }
}

export async function leaveGroup(groupIdx: string): Promise<void> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/leave`), {
    method: 'post',
    headers: { cookie },
  });
  if (resp.status === 400) {
    throw new BadRequestError('잘못된 요청입니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 가입 신청에 실패했습니다.');
  }
}

const groupMemberSchema = z.object({
  uid: z.number(),
  name: z.string(),
  studentNumber: z.string(),
});
export type GroupMember = z.infer<typeof groupMemberSchema>;
export async function listGroupMembers(groupIdx: string): Promise<GroupMember[]> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/members`), {
    next: {
      tags: [`group/${groupIdx}`],
    },
    headers: { cookie },
  });
  if (resp.status === 401) {
    throw new ForbiddenError('그룹 관리자가 아닙니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 멤버 목록을 가져오는 데 실패했습니다.');
  }

  const body = z.array(groupMemberSchema).parse(await resp.json());
  return body;
}

export async function listPendingGroupMembers(groupIdx: string): Promise<GroupMember[]> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/pending`), {
    next: {
      tags: [`group/${groupIdx}`],
    },
    headers: { cookie },
  });
  if (resp.status === 401) {
    throw new ForbiddenError('그룹 관리자가 아닙니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 멤버 목록을 가져오는 데 실패했습니다.');
  }

  const body = z.array(groupMemberSchema).parse(await resp.json());
  return body;
}

export async function acceptPendingGroupMembers(groupIdx: string, uid: number[]): Promise<void> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/accept`), {
    method: 'post',
    body: JSON.stringify(uid),
    headers: {
      'content-type': 'application/json',
      cookie,
    },
  });
  if (resp.status === 401) {
    throw new ForbiddenError('그룹 관리자가 아닙니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 멤버 승인에 실패했습니다.');
  }

  revalidateTag(`group/${groupIdx}`);
}

export async function rejectOrRemoveGroupMembers(groupIdx: string, uid: number[]): Promise<void> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/api/group/${groupIdx}/reject`), {
    method: 'post',
    body: JSON.stringify(uid),
    headers: {
      'content-type': 'application/json',
      cookie,
    },
  });
  if (resp.status === 401) {
    throw new ForbiddenError('그룹 관리자가 아닙니다.');
  }
  if (!resp.ok) {
    throw new Error('그룹 멤버 제외에 실패했습니다.');
  }

  revalidateTag(`group/${groupIdx}`);
}

const signupEmailSchema = z.object({
  emailLocal: z.string(),
  emailDomain: z.string(),
});
export type SignupEmail = z.infer<typeof signupEmailSchema>;

export async function checkEmailToken(token: string): Promise<SignupEmail> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl('/api/email/check-token'), {
    method: 'post',
    body: JSON.stringify({ token }),
    headers: {
      'content-type': 'application/json',
      cookie,
    },
  });
  if (resp.status === 401) {
    throw new ForbiddenError('토큰 확인에 실패했습니다.');
  }
  if (!resp.ok) {
    throw new Error('토큰 확인에 실패했습니다.');
  }

  const body = signupEmailSchema.parse(await resp.json());
  return body;
}

export async function checkPasswordToken(token: string): Promise<void> {
  const resp = await fetch(apiUrl('/api/user/check-password-token'), {
    method: 'post',
    body: JSON.stringify({ token }),
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  });
  if (resp.status === 401) {
    throw new ForbiddenError('토큰 확인에 실패했습니다.');
  }
  if (!resp.ok) {
    throw new Error('토큰 확인에 실패했습니다.');
  }
}
