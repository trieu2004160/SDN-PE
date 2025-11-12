import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

