import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { checkEmailToken, ForbiddenError, SignupEmail } from '@/api';

import EmailForm from './EmailForm';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: '가입하기',
};

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

  return (
    <Suspense fallback={<SignupForm />}>
      <SignupFormWrapper token={token} email={checkEmailToken(token)} />
    </Suspense>
  );
}

async function SignupFormWrapper(props: { token: string; email: Promise<SignupEmail> }) {
  let email;
  try {
    email = await props.email;
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <>
          <section className="border rounded p-2 mb-2 space-y-2">
            <h2 className="text-h2">토큰 확인 실패</h2>
            <p>
              토큰이 유효하지 않거나 만료되었습니다. 가입 안내 메일을 통해 접속하신 경우, 아래
              내용을 확인해 주세요.
            </p>
            <ul className="list-disc pl-4">
              <li>토큰은 메일 발송 24시간 후에 만료됩니다.</li>
              <li>
                가장 마지막에 발송된 메일의 토큰만 유효합니다. 메일 발송 후 받은메일함에
                도착하기까지 시간이 걸릴 수 있으므로, 가입 신청을 하신 후 메일이 도착할 때까지
                기다려 주시기 바랍니다.
              </li>
              <li>
                가입 안내 메일 발송을 여러 번 시도하신 경우, 토큰을 더 이상 받을 수 없게 됩니다. 이
                경우, 가입 신청에 사용한 이메일 주소를 사용해 <span>contact</span>
                <span className="before:content-['@']">bacchus.snucse.org</span>로 문의
                부탁드립니다.
              </li>
            </ul>
          </section>
          <div className="flex flex-row-reverse">
            <Link className="text-link" href="/">홈으로 돌아가기</Link>
          </div>
        </>
      );
    }
    throw e;
  }

  return <SignupForm token={props.token} email={email} />;
}
