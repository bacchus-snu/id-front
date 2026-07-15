import { Metadata } from 'next';

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
    title: dict.signUp.email.emailSent.smallTitle,
  };
}

export default async function EmailSent(props: Props) {
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  const emailSentDict = dict.signUp.email.emailSent;
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{emailSentDict.smallTitle}</h2>
      {emailSentDict.descriptions.map((desc, index) => (
        // FIXME: 좀 더 제대로 된 i18n 라이브러리 써서 교체하기
        <p key={index} dangerouslySetInnerHTML={{ __html: desc }} />
      ))}
    </section>
  );
}
