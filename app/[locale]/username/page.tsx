import { getDictionary, Locale } from '@/locale';
import { Metadata } from 'next';

import EmailForm from './EmailForm';

type Props = {
  params: { locale: Locale };
  searchParams: {
    token?: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.findUsername,
  };
}

export default async function UsernamePage({}: Props) {
  return <EmailForm />;
}
