import { Metadata } from 'next';
import Link from 'next/link';

import { getDictionary, Locale } from '@/locale';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  return {
    title: dict.title.signUp,
  };
}

export default async function SignupDone(props: Props) {
  const params = await props.params;

  const {
    locale,
  } = params;

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
