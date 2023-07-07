import { Metadata } from 'next';
import Link from 'next/link';

import { getDictionary, Locale } from '@/locale';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.signUp,
  };
}

export default async function SignupDone({
  params: { locale },
}: Props) {
  const dict = await getDictionary(locale);
  return (
    <>
      <section className="border rounded p-2 mb-2">
        <h2 className="text-h2 mb-2">{dict.title.signUpDone}</h2>
        <p>{dict.signUp.signUpDone}</p>
      </section>
      <div className="flex flex-row-reverse">
        <Link className="text-link" href="/">{dict.links.returnToHome}</Link>
      </div>
    </>
  );
}
