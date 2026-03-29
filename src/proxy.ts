import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Build a mutable response to forward Set-Cookie headers from Supabase session refresh
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write cookies onto both the forwarded request and the response so
          // the refreshed session is available in Server Components.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — IMPORTANT: do not add any logic between createServerClient
  // and getUser() or the session may not be properly refreshed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // Unauthenticated user trying to access a protected route → /login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.nextUrl)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user visiting /login or /register → /dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
