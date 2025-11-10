import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }
  
  return user
}

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}