import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { checkPasswordToken, ForbiddenError } from '@/api';
import { Dict, getDictionary, Locale } from '@/locale';

import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  return {
    title: dict.title.changePassword,
  };
}

export default async function PasswordPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  const { token } = searchParams;
  if (token == null) {
    return <EmailForm />;
  }

  return (
    <Suspense fallback={<PasswordForm />}>
      <PasswordFormWrapper dict={dict} token={checkPasswordToken(token).then(() => token)} />
    </Suspense>
  );
}

async function PasswordFormWrapper(props: { dict: Dict; token: Promise<string> }) {
  const changePasswordDict = props.dict.changePassword;

  let token;
  try {
    token = await props.token;
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <>
          <section className="border rounded p-2 mb-2 space-y-2">
            <h2 className="text-h2">{changePasswordDict.tokenFailure.smallTitle}</h2>
            <p>{changePasswordDict.tokenFailure.description}</p>
            <ul className="list-disc pl-4">
              {changePasswordDict.tokenFailure.details.map((text, index) => (
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

  return <PasswordForm token={token} />;
}
