import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  if (
    token &&
    (
      url.pathname === '/' || 
      url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/verify')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}
export const config = {
    // this matcher is basically not means 
    // routes inside it is public or private
    // it basically invokes the middleware to check the token
  matcher: [
    '/',
    '/auth/login',
    '/auth/register',
    '/dashboard',
  ],
}