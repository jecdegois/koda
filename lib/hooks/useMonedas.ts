'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

export interface Moneda {
  id: string
  user_id: string
  descripcion: string
  precio: number
  is_base: boolean
  created_at: string
  updated_at: string
}

const fetcher = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('monedas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export function useMonedas() {
  const { data, error, mutate } = useSWR<Moneda[]>('monedas', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  return {
    monedas: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  }
}
