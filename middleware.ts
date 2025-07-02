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
      url.pathname.startsWith('/auth/login') ||
      url.pathname.startsWith('/auth/register')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (!token && url.pathname.startsWith('/settings')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/auth/register',
    '/dashboard',
    '/settings',
    '/auth/reset',
    '/auth/new-password',
    '/settings/server',
  ],
}