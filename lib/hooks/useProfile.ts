import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

export interface Profile {
  id: string
  full_name?: string
  last_name?: string
  avatar_url?: string
  email?: string
  created_at: string
  updated_at: string
}

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data as Profile
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR('profile', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    profile: data,
    isLoading,
    error,
    mutate,
  }
}

export async function updateProfile(updates: Partial<Profile>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}
