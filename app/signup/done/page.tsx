import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '가입 완료',
};

export default function SignupDone() {
  return (
    <>
      <section className="border rounded p-2 mb-2">
        <h2 className="text-h2 mb-2">가입 완료</h2>
        <p>가입이 완료되었습니다. 로그인해 주세요.</p>
      </section>
      <div className="flex flex-row-reverse">
        <Link className="text-link" href="/">홈으로 돌아가기</Link>
      </div>
    </>
  );
}
