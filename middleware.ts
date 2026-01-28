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
  const search = request.nextUrl.search;
  if (/^\/oauth\/[^\/]+\/action\//.test(pathname)) {
    // /oauth/:uid/action/:rest*
    // 백엔드로 그대로 전달
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, process.env.API_BASE);
    return NextResponse.rewrite(url);
  }

  let cookieLocale = request.cookies.get('locale')?.value;
  if (!locales.includes(cookieLocale ?? '')) {
    cookieLocale = undefined;
  }

  let resp;
  let matchingLocale;
  if (
    ['/signup/email', '/signup/create', '/password/email', '/password/change', '/user/student-numbers'].includes(pathname) ||
    /^\/group\/[^\/]+\/membership$/.test(pathname) ||
    /^\/session\/[^\/]+$/.test(pathname) ||
    /^\/oauth\/[^\/]+$/.test(pathname)
  ) {
    matchingLocale = cookieLocale ?? getLocale(request);

    const headers = new Headers(request.headers);
    headers.set('x-new-locale', matchingLocale);
    resp = NextResponse.next({
      request: { headers },
    });
  } else {
    matchingLocale = locales.find(
      locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (matchingLocale == null) {
      matchingLocale = cookieLocale ?? getLocale(request);

      resp = NextResponse.redirect(
        new URL(`/${matchingLocale}${pathname}${search}`, request.url)
      );
    } else {
      const headers = new Headers(request.headers);
      headers.set('x-new-locale', matchingLocale);
      resp = NextResponse.next({
        request: { headers },
      });
    }
  }

  if (matchingLocale !== cookieLocale) {
    resp.cookies.set('locale', matchingLocale, { path: '/' });
  }

  return resp;
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon\.ico).*)',
  ],
};
