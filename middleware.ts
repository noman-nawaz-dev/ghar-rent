import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRedirects: Record<string, string> = {
  buyer: '/home',
  seller: '/seller/dashboard',
  admin: '/admin/dashboard',
}

const protectedRoutes = [
  { path: '/seller/dashboard', role: 'seller' },
  { path: '/admin/dashboard', role: 'admin' },
  { path: '/buyer/dashboard', role: 'buyer' },
]

const authPages = ['/auth/login', '/auth/register']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  const url = req.nextUrl.pathname

  if (session) {
    // Get user role from users table
    const { data: user } = await supabase.from('users').select('role').eq('id', session.user.id).single()
    const role = user?.role

    // Restrict access to auth pages for logged-in users
    if (authPages.includes(url)) {
      if (role && roleRedirects[role]) {
        return NextResponse.redirect(new URL(roleRedirects[role], req.url))
      }
    }

    // Restrict access to other dashboards
    for (const route of protectedRoutes) {
      if (url.startsWith(route.path) && role !== route.role) {
        // Redirect to correct dashboard or home
        if (role && roleRedirects[role]) {
          return NextResponse.redirect(new URL(roleRedirects[role], req.url))
        } else {
          return NextResponse.redirect(new URL('/', req.url))
        }
      }
    }
  } else {
    // Not logged in: restrict dashboard access
    for (const route of protectedRoutes) {
      if (url.startsWith(route.path)) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }
  }

  return res
}
