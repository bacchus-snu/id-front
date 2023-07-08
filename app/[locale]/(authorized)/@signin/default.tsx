import Link from 'next/link';

import { getDictionary, Locale } from '@/locale';

import SignInForm from './SignInForm';

type Props = {
  params: { locale: Locale };
};

export default async function SignIn({
  params: { locale },
}: Props) {
  const dict = await getDictionary(locale);
  const signUpNodes: React.ReactNode[] = dict.signIn.signUpLabel.split('{}');
  const changePasswordNodes: React.ReactNode[] = dict.signIn.changePasswordLabel.split('{}');
  signUpNodes.splice(
    1,
    0,
    <Link key="link" className="text-link" href="/signup">{dict.links.signUp}</Link>,
  );
  changePasswordNodes.splice(
    1,
    0,
    <Link className="text-link" href="/password">{dict.links.changePassword}</Link>,
  );

  return (
    <>
      <SignInForm />
      <section className="text-right w-full max-w-xs mx-auto mt-2">
        <div>{signUpNodes}</div>
        <div>{changePasswordNodes}</div>
      </section>
    </>
  );
}
