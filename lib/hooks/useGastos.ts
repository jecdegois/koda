'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

export interface Gasto {
  id: string
  user_id: string
  descripcion: string
  monto: number
  moneda_id: string
  fecha: string
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
    .from('gastos')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })

  if (error) throw error
  return data || []
}

export function useGastos() {
  const { data, error, mutate } = useSWR<Gasto[]>('gastos', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  return {
    gastos: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  }
}
