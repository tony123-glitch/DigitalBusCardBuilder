'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function archiveCard(id: string, isArchived: boolean) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient
    .from('cards')
    .update({ is_archived: isArchived })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deleteCard(id: string) {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient
    .from('cards')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deleteAllArchivedCards() {
  const adminClient = createAdminClient()
  
  const { error } = await adminClient
    .from('cards')
    .delete()
    .eq('is_archived', true)

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}
