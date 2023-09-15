import SignIn from '@/components/SignIn';
import { Locale } from '@/locale';

type Props = {
  params: { locale: Locale };
};

export default async function SignInPage({
  params: { locale },
}: Props) {
  return <SignIn locale={locale} />;
}
