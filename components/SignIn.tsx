import Link from 'next/link';

import SignInForm from '@/components/SignInForm';
import { getDictionary, Locale } from '@/locale';

type Props = {
  locale: Locale;
  oauthUid?: string;
};

export default async function SignIn({ locale, oauthUid }: Props) {
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
      <SignInForm oauthUid={oauthUid} />
      <section className="text-right w-full max-w-xs mx-auto mt-2">
        <div>{signUpNodes}</div>
        <div>{changePasswordNodes}</div>
      </section>
    </>
  );
}
