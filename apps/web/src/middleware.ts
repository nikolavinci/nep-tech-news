import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const locales = ['en', 'np'];
const defaultLocale = 'en';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Exclude static files, API routes, and system files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/feed.xml'
  ) {
    return;
  }

  // Check if the path is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect to default locale if missing
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, req.url)
    );
  }
}) as any;

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|sitemap.xml|robots.txt|feed.xml).*)'],
};
