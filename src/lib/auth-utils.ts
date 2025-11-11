// lib/auth-utils.ts
import { createClient } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'employee'

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = createClient()
  
  const { data: employee, error } = await supabase
    .from('employees')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !employee) {
    return 'employee'
  }

  return employee.role as UserRole
}

export function isAdminRoute(pathname: string): boolean {
  const adminRoutes = [
    '/dashboard/employees',
    '/dashboard/analytics'
  ]
  
  return adminRoutes.some(route => pathname.startsWith(route))
}

export function hasAccess(userRole: UserRole, pathname: string): boolean {
  if (userRole === 'admin') return true
  
  const employeeRoutes = [
    '/dashboard',
    '/dashboard/chat',
    '/dashboard/profile',
    '/dashboard/settings'
  ]
  
  return employeeRoutes.some(route => pathname.startsWith(route))
}