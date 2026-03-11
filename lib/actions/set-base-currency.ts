'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setBaseCurrency(monedaId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No authenticated user')
  }

  // First, set all monedas to is_base = false
  await supabase
    .from('monedas')
    .update({ is_base: false })
    .eq('user_id', user.id)

  // Then set the selected one to is_base = true
  const { error } = await supabase
    .from('monedas')
    .update({ is_base: true })
    .eq('id', monedaId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to set base currency: ${error.message}`)
  }

  revalidatePath('/dashboard')
}
