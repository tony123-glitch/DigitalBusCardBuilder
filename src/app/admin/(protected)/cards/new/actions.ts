'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function createCard(formData: FormData) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const adminClient = createAdminClient()

  const owner_name = formData.get('owner_name') as string
  const slug = formData.get('slug') as string
  const edit_password = formData.get('edit_password') as string
  const company_name = formData.get('company_name') as string
  const theme_color = formData.get('theme_color') as string || '#0F172A'

  if (!owner_name || !slug || !edit_password) {
    return { error: 'Owner Name, Slug, and Edit Password are required' }
  }

  // Hash the password securely
  const salt = await bcrypt.genSalt(10)
  const edit_password_hash = await bcrypt.hash(edit_password, salt)

  const { data: card, error } = await adminClient
    .from('cards')
    .insert({
      owner_name,
      slug,
      edit_password_hash,
      company_name,
      theme_color,
      is_published: false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'Slug is already taken. Please choose another.' }
    }
    return { error: error.message }
  }

  revalidatePath('/admin', 'layout')
  redirect(`/admin/cards/${card.id}/edit`)
}
