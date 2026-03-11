import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

export interface Config {
  theme?: string
  [key: string]: any
}

export interface Configuracion {
  id: string
  user_id: string
  config: Config
  created_at: string
  updated_at: string
}

const fetcher = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('configuracion')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is row not found
    throw error
  }
  
  return data as Configuracion | null
}

export function useConfig() {
  const { data, error, isLoading, mutate } = useSWR('configuracion', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    configuracion: data,
    config: data?.config || {},
    isLoading,
    error,
    mutate,
  }
}
