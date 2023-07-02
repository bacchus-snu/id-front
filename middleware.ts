import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { getSupportedLocales } from './locale';

const locales = getSupportedLocales();

function getLocale(request: Request) {
  return new Negotiator({
    headers: Object.fromEntries(request.headers.entries()),
  }).language(locales) ?? 'ko';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (/^\/oauth\/[^\/]+\/action\//.test(pathname)) {
    // /oauth/:uid/action/:rest*
    // 백엔드로 그대로 전달
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, process.env.API_BASE);
    return NextResponse.rewrite(url);
  }

  if (/^\/oauth\/[^\/]+$/.test(pathname)) {
    // /oauth/:uid
    if (request.nextUrl.searchParams.get('locale')) {
      return;
    }

    const url = new URL(request.url);
    const locale = getLocale(request);
    url.searchParams.set('locale', locale);
    return NextResponse.redirect(url);
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon\.ico).*)',
  ],
};
