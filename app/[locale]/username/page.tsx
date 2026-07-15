import { getDictionary, Locale } from '@/locale';
import { Metadata } from 'next';

import EmailForm from './EmailForm';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
  } = params;

  const dict = await getDictionary(locale);
  return {
    title: dict.title.findUsername,
  };
}

export default async function UsernamePage({}: Props) {
  return <EmailForm />;
}
