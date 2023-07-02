import { apiUrl } from '@/api';

export const dynamic = 'force-dynamic';

export function GET(
  request: Request,
  { params }: { params: { uid: string; action: string } },
): Promise<Response> {
  const cookie = request.headers.get('cookie');
  return fetch(apiUrl(`/oauth/${params.uid}/action/${params.action}`), {
    method: 'get',
    headers: {
      cookie: cookie ?? '',
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: { uid: string; action: string } },
): Promise<Response> {
  const cookie = request.headers.get('cookie');
  const body = await request.arrayBuffer();
  return fetch(apiUrl(`/oauth/${params.uid}/action/${params.action}`), {
    method: 'post',
    body,
    headers: {
      'content-type': request.headers.get('content-type') ?? '',
      cookie: cookie ?? '',
    },
  });
}
