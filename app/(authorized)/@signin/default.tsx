import Link from 'next/link';

import SignInForm from './SignInForm';

export default function Login() {
  return (
    <>
      <SignInForm />
      <section className="text-right w-full max-w-xs mx-auto mt-2">
        <div>
          계정이 없으신가요? <Link className="text-link" href="/signup">가입하기</Link>
        </div>
        <div>
          비밀번호를 잊으셨나요? <Link className="text-link" href="/password">비밀번호 변경</Link>
        </div>
      </section>
    </>
  );
}
