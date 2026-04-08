import Link from 'next/link';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import Button from '@/components/Button';
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
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">{dict.canvas.title}</h2>
        <p>{dict.canvas.dashboardDescription}</p>
        <div className="flex flex-col items-end mt-2">
          <Link className="w-full max-w-32" href={`/${locale}/canvas`}>
            <Button className="w-full font-bold" type="button" color="primary">
              {dict.canvas.title}
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
}
