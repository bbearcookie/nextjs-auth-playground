import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { sessionOptions } from '@/config/session-options';
import { SessionType } from './types/session';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getIronSession<SessionType>(req, res, sessionOptions);

  console.log('session in middleware', session);

  if (req.nextUrl.pathname.startsWith('/shop') && !session['accessToken']) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
