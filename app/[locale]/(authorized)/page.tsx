import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import { getDictionary, Locale } from '@/locale';

import ChangePassword from './ChangePassword';
import Groups from './Groups';
import StudentId from './StudentId';

type Props = {
  params: { locale: Locale };
};

export default async function Home({
  params: { locale },
}: Props) {
  const sessionInfo = await checkSession();
  if (!sessionInfo.signedIn) {
    redirect('/signin');
  }

  const dict = await getDictionary(locale);

  return (
    <section className="space-y-4">
      <p className="text-center">{dict.welcome.replaceAll('{}', sessionInfo.username)}</p>
      <Groups dict={dict} />
      <ChangePassword dict={dict} />
      <StudentId dict={dict} />
    </section>
  );
}
