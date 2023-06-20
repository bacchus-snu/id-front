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
      </section>
    </>
  );
}
