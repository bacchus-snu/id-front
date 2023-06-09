import { cookies, headers } from 'next/headers';

const dict = {
  ko: () => import('./ko.json').then(module => module.default),
  en: () => import('./en.json').then(module => module.default),
};

export type Locale = keyof typeof dict;
export type Dict =
  & Awaited<ReturnType<typeof dict['ko']>>
  & { validity: Record<string, string> };

export function getSupportedLocales(): string[] {
  return Object.keys(dict);
}

export function getDictionary(locale: Locale): Promise<Dict> {
  return dict[locale]();
}

export function getLocaleFromCookie(): Locale {
  const locale = headers().get('x-new-locale') ?? cookies().get('locale')?.value;
  return (locale ?? 'ko') as Locale;
}
