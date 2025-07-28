
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/login',
    '/register',
    '/',                     
    '/my-cards/:path*',
    '/create-card',
    '/edit-card/:path*',
    '/approve',
    '/manage-users',
  ],
};

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const refreshToken = cookies.get('refreshToken')?.value;

  const pathname = nextUrl.pathname;
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicPage = pathname === '/';

 
  if (refreshToken) {

    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    

    return NextResponse.next();
  } else {
  
    if (isAuthPage || isPublicPage) {
      
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}
