import Link from 'next/link';

import SignInForm from '@/components/SignInForm';
import { getDictionary, Locale } from '@/locale';

type Props = {
  locale: Locale;
};

export default async function SignIn({ locale }: Props) {
  const dict = await getDictionary(locale);
  const signUpNodes: React.ReactNode[] = dict.signIn.signUpLabel.split('{}');
  const findUsernameNodes: React.ReactNode[] = dict.signIn.findUsernameLabel.split('{}');
  const changePasswordNodes: React.ReactNode[] = dict.signIn.changePasswordLabel.split('{}');
  signUpNodes.splice(
    1,
    0,
    <Link key="link" className="text-link" href="/signup">{dict.links.signUp}</Link>,
  );
  findUsernameNodes.splice(
    1,
    0,
    <Link key="link" className="text-link" href="/username">{dict.links.findUsername}</Link>,
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
        <div>{findUsernameNodes}</div>
        <div>{changePasswordNodes}</div>
      </section>
    </>
  );
}
