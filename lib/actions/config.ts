'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Config } from '@/lib/hooks/useConfig'

export async function serverUpdateConfig(updates: Partial<Config>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get current config to merge
  const { data: current, error: fetchError } = await supabase
    .from('configuracion')
    .select('config')
    .eq('user_id', user.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const mergedConfig = {
    ...(current?.config || {}),
    ...updates,
  }

  const { data, error } = await supabase
    .from('configuracion')
    .upsert(
      { 
        user_id: user.id, 
        config: mergedConfig 
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw error

  // Revalidate paths
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')

  return data
}
