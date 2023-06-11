import Link from 'next/link';

import { checkEmailToken, ForbiddenError } from '@/api';

import EmailForm from './EmailForm';

type Props = {
  searchParams: {
    token?: string;
  };
};
export default async function Signup({ searchParams }: Props) {
  const { token } = searchParams;
  if (token == null) {
    return (
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">가입하기</h2>
        <p>
          가입에 사용할 이메일 주소를 입력하세요. 스누메일(@snu.ac.kr)만 사용 가능합니다.
        </p>
        <EmailForm />
      </section>
    );
  }

  let email;
  try {
    email = await checkEmailToken(token);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <section>
          <p>잘못된 접근입니다.</p>
          <Link className="text-link" href="/">홈으로 돌아가기</Link>
        </section>
      );
    }
  }

  return null;
}
