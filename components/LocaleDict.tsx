'use client';

import { createContext, useContext } from 'react';

import type { Dict, Locale } from '@/locale';

type LocaleDictContext = {
  locale: Locale;
  dict: Dict;
};

const Context = createContext<LocaleDictContext | null>(null);

export function LocaleDictProvider(props: LocaleDictContext & { children?: React.ReactNode }) {
  const { children, ...value } = props;
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export default function useLocaleDict() {
  const ctx = useContext(Context);
  if (ctx == null) {
    throw new Error('locale context not found');
  }

  return ctx;
}
