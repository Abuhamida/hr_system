// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/employees',
    '/dashboard/chat',
    '/dashboard/profile',
    '/dashboard/settings'
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If no session and trying to access protected route, redirect to login
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated, check role-based access
  if (session && isProtectedRoute) {
    // Get user role from employees table
    const { data: employee, error } = await supabase
      .from('employees')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = employee?.role || 'employee'

    // Define admin-only routes
    const adminOnlyRoutes = [
      '/dashboard/employees',
    ]

    const isAdminOnlyRoute = adminOnlyRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    // If user is not admin and trying to access admin-only route, redirect to dashboard
    if (isAdminOnlyRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Add user role to headers for use in client components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', userRole)
    requestHeaders.set('x-user-id', session.user.id)

    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set('x-user-role', userRole)
    response.headers.set('x-user-id', session.user.id)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes (login, signup, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth|api|$).*)',
  ],
}