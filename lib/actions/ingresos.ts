'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Ingreso {
  id: string
  user_id: string
  descripcion: string
  monto: number
  moneda_id: string
  fecha: string
  created_at: string
  updated_at: string
}

export async function serverCreateIngreso(
  ingreso: Omit<Ingreso, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('ingresos')
    .insert([{ ...ingreso, user_id: user.id }])
    .select()
    .single()

  if (error) throw error

  // Revalidate paths to update UI in real-time
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')

  return data
}

export async function serverUpdateIngreso(
  id: string,
  updates: Partial<Omit<Ingreso, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ingresos')
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

export async function serverDeleteIngreso(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('ingresos').delete().eq('id', id)

  if (error) throw error

  // Revalidate paths
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
}
