import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { checkEmailToken, ForbiddenError, SignupEmail } from '@/api';

import { Dict, getDictionary, Locale } from '@/locale';
import EmailForm from './EmailForm';
import SignupForm from './SignupForm';

type Props = {
  params: { locale: Locale };
  searchParams: {
    token?: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.signUp,
  };
}

export default async function Signup({
  params: { locale },
  searchParams,
}: Props) {
  const dict = await getDictionary(locale);
  const { token } = searchParams;
  if (token == null) {
    return (
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">{dict.title.signUp}</h2>
        <p>{dict.signUp.email.description}</p>
        <EmailForm />
      </section>
    );
  }

  return (
    <Suspense fallback={<SignupForm />}>
      <SignupFormWrapper dict={dict} token={token} email={checkEmailToken(token)} />
    </Suspense>
  );
}

async function SignupFormWrapper(
  props: { dict: Dict; token: string; email: Promise<SignupEmail> },
) {
  let email;
  try {
    email = await props.email;
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <>
          <section className="border rounded p-2 mb-2 space-y-2">
            <h2 className="text-h2">{props.dict.signUp.tokenFailure.smallTitle}</h2>
            <p>{props.dict.signUp.tokenFailure.description}</p>
            <ul className="list-disc pl-4">
              {props.dict.signUp.tokenFailure.details.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </section>
          <div className="flex flex-row-reverse">
            <Link className="text-link" href="/">{props.dict.links.returnToHome}</Link>
          </div>
        </>
      );
    }
    throw e;
  }

  return <SignupForm token={props.token} email={email} />;
}
