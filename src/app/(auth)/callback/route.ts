import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_failed`)
    }

    if (user) {
      // Check if this is a new user by looking for an employee record
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      // If no employee record exists, the trigger should create one
      // We can add a small delay to ensure the trigger has executed
      if (!employee) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}