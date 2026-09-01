import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { getSupportedLocales } from './locale';

const locales = getSupportedLocales();

function createContentSecurityPolicy(nonce: string) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const developmentScriptSource = isDevelopment ? " 'unsafe-eval'" : '';

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${developmentScriptSource}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

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

  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = createContentSecurityPolicy(nonce);
  let cookieLocale = request.cookies.get('locale')?.value;
  if (!locales.includes(cookieLocale ?? '')) {
    cookieLocale = undefined;
  }

  let resp;
  let matchingLocale;
  if (
    ['/signup/email', '/signup/create', '/password/email', '/password/change', '/user/student-numbers', '/user/email', '/username/email'].includes(pathname) ||
    /^\/group\/[^\/]+\/membership$/.test(pathname) ||
    /^\/session\/[^\/]+$/.test(pathname) ||
    /^\/oauth\/[^\/]+$/.test(pathname)
  ) {
    matchingLocale = cookieLocale ?? getLocale(request);

    const headers = new Headers(request.headers);
    headers.set('x-new-locale', matchingLocale);
    headers.set('x-nonce', nonce);
    headers.set('Content-Security-Policy', contentSecurityPolicy);
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
      headers.set('x-nonce', nonce);
      headers.set('Content-Security-Policy', contentSecurityPolicy);
      resp = NextResponse.next({
        request: { headers },
      });
    }
  }

  if (matchingLocale !== cookieLocale) {
    resp.cookies.set('locale', matchingLocale, { path: '/' });
  }
  resp.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return resp;
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon\.ico|robots\.txt).*)',
  ],
};
