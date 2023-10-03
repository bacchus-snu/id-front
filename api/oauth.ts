import { headers } from 'next/headers';
import * as z from 'zod';
import { apiUrl, ForbiddenError } from '.';

const consentDetailsSchema = z.object({
  missingOIDCScope: z.optional(z.array(z.string())),
  missingOIDCClaims: z.optional(z.array(z.string())),
  missingResourceScopes: z.optional(z.record(z.array(z.string()))),
});
export type ConsentDetails = z.infer<typeof consentDetailsSchema>;

const oauthClientSchema = z.object({
  name: z.string().optional(),
  uri: z.string().optional(),
  logoUri: z.string().optional(),
  contacts: z.string().array().optional(),
});
export type OAuthClient = z.infer<typeof oauthClientSchema>;

const interactionDetailsSchema = z.object({
  prompt: z.union([
    z.object({
      name: z.literal('login'),
    }),
    z.object({
      name: z.literal('consent'),
      details: consentDetailsSchema,
    }),
  ]),
  params: z.object({
    client_id: z.string().optional(),
    scope: z.string().array().optional(),
  }),
  client: oauthClientSchema.optional(),
});
export type InteractionDetails = z.infer<typeof interactionDetailsSchema>;

export async function getInteractionDetails(uid: string): Promise<InteractionDetails> {
  const cookie = headers().get('cookie') || '';
  const resp = await fetch(apiUrl(`/oauth/${uid}/details`), {
    method: 'get',
    headers: { cookie },
  });
  if (!resp.ok) {
    console.error(await resp.text());
    throw new ForbiddenError('토큰 확인에 실패했습니다.');
  }

  const rawBody = await resp.json();
  console.debug(JSON.stringify(rawBody, null, 2));
  const body = interactionDetailsSchema.parse(rawBody);
  return body;
}
