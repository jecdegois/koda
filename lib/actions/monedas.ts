'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Moneda {
  id: string
  user_id: string
  descripcion: string
  precio: number
  created_at: string
  updated_at: string
}

export async function serverCreateMoneda(
  moneda: Omit<Moneda, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('monedas')
    .insert([{ ...moneda, user_id: user.id }])
    .select()
    .single()

  if (error) throw error

  // Revalidate paths to update UI in real-time
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')

  return data
}

export async function serverUpdateMoneda(
  id: string,
  updates: Partial<Omit<Moneda, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('monedas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // Revalidate paths
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')

  return data
}

export async function serverDeleteMoneda(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('monedas').delete().eq('id', id)

  if (error) throw error

  // Revalidate paths
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
}
