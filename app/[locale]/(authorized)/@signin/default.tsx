import SignIn from '@/components/SignIn';
import { Locale } from '@/locale';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function SignInPage(props: Props) {
  const params = await props.params;

  const {
    locale,
  } = params;

  return <SignIn locale={locale} />;
}
