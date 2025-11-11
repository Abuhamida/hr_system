// app/api/auth/role/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: employee, error } = await supabase
      .from('employees')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !employee) {
      return NextResponse.json({ role: 'employee' })
    }

    return NextResponse.json({ role: employee.role })
  } catch (error) {
    return NextResponse.json({ role: 'employee' })
  }
}