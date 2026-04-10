import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { checkSession } from '@/api';
import Button from '@/components/Button';
import { getDictionary, Locale } from '@/locale';

import ChangePassword from './ChangePassword';
import GoogleResult from './GoogleResult';
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
      <Suspense>
        <GoogleResult />
      </Suspense>
      <p className="text-center">{dict.welcome.replaceAll('{}', sessionInfo.name)}</p>
      <section className="border rounded p-2">
        <h2 className="text-h2 mb-2">{dict.google.title}</h2>
        <p>{dict.google.description}</p>
        <div className="flex flex-col items-end mt-2">
          <a className="w-full max-w-32" href="/api/google/auth">
            <Button className="w-full font-bold" type="button" color="primary">
              {dict.google.verifyButton}
            </Button>
          </a>
        </div>
      </section>
      <Groups dict={dict} />
      <StudentId dict={dict} />
      <ChangePassword dict={dict} />
    </section>
  );
}
