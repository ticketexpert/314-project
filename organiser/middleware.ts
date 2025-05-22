import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value
  const userId = request.cookies.get('userId')?.value
  const token = request.cookies.get('token')?.value
  const organizationId = request.cookies.get('organizationId')?.value

  // Allow access to initial signup page
  if (request.nextUrl.pathname === '/signup') {
    return NextResponse.next()
  }

  // If user is not logged in (no userId or token) and trying to access protected routes
  if ((!userId || !token) && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in but not an organiser
  if (userId && userRole !== 'Organiser' && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in as organiser but has no organization
  if (userId && token && userRole === 'Organiser' && !organizationId) {
    // Allow access to organiser details page
    if (request.nextUrl.pathname === '/signup/organiser-details') {
      return NextResponse.next()
    }
    // Redirect to organiser details for all other protected routes
    return NextResponse.redirect(new URL('/signup/organiser-details', request.url))
  }

  // If user is not logged in and trying to access /home
  if ((!userId || !token) && request.nextUrl.pathname === '/home') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
    '/tickets/:path*',
    '/login',
    '/home',
    '/signup/organiser-details'
  ]
}