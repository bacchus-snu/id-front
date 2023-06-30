const dict = {
  ko: () => import('./ko.json').then(module => module.default),
};

export type Locale = keyof typeof dict;
export type Dict =
  & Awaited<ReturnType<typeof dict['ko']>>;

export function getSupportedLocales(): string[] {
  return Object.keys(dict);
}

export function getDictionary(locale: Locale) {
  return dict[locale]();
}
