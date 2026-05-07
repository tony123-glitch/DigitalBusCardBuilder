'use server'

import { createAdminClient } from '@/utils/supabase/server'
import * as jose from 'jose'
import { revalidatePath } from 'next/cache'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-production'
)

export async function saveCustomerCard(formData: FormData) {
  const token = formData.get('token') as string
  if (!token) return { error: 'Unauthorized' }

  let payload
  try {
    const { payload: decoded } = await jose.jwtVerify(token, JWT_SECRET)
    payload = decoded
  } catch (err) {
    return { error: 'Invalid or expired session' }
  }

  const slug = payload.slug as string
  if (!slug) return { error: 'Invalid token payload' }

  const adminClient = createAdminClient()

  // Verify the card exists
  const { data: existingCard, error: fetchError } = await adminClient
    .from('cards')
    .select('id')
    .eq('slug', slug)
    .single()

  if (fetchError || !existingCard) {
    return { error: 'Card not found' }
  }

  // Extract all fields
  const updates = {
    owner_name: formData.get('owner_name') as string,
    job_title: formData.get('job_title') as string,
    company_name: formData.get('company_name') as string,
    company_tagline: formData.get('company_tagline') as string,
    bio: formData.get('bio') as string,
    phone_number: formData.get('phone_number') as string,
    email: formData.get('email') as string,
    website: formData.get('website') as string,
    location: formData.get('location') as string,
    theme_color: formData.get('theme_color') as string,
    // Note: image URLs are updated directly via the uploadImage action, so we don't necessarily need to overwrite them here 
    // unless they changed without an upload (e.g. removal).
  }

  // Parse JSON fields safely
  const socialLinksStr = formData.get('card_social_links') as string
  const customBtnsStr = formData.get('card_custom_buttons') as string

  if (socialLinksStr) {
    try {
      (updates as any).card_social_links = JSON.parse(socialLinksStr)
    } catch (e) {}
  }

  if (customBtnsStr) {
    try {
      (updates as any).card_custom_buttons = JSON.parse(customBtnsStr)
    } catch (e) {}
  }

  // Ensure arrays are null if empty so DB accepts them properly (if using jsonb)
  if ((updates as any).card_social_links?.length === 0) (updates as any).card_social_links = null
  if ((updates as any).card_custom_buttons?.length === 0) (updates as any).card_custom_buttons = null

  const { error: updateError } = await adminClient
    .from('cards')
    .update(updates)
    .eq('id', existingCard.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath(`/card/${slug}`)
  revalidatePath(`/card/${slug}/edit`)

  return { success: true }
}
