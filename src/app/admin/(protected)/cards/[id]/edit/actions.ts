'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function updateCard(id: string, formData: FormData) {

  const adminClient = createAdminClient()

  const owner_name = formData.get('owner_name') as string
  const slug = formData.get('slug') as string
  const company_name = formData.get('company_name') as string
  const company_tagline = formData.get('company_tagline') as string
  const job_title = formData.get('job_title') as string
  const phone_number = formData.get('phone_number') as string
  const email = formData.get('email') as string
  const website = formData.get('website') as string
  const location = formData.get('location') as string
  const bio = formData.get('bio') as string
  const is_published = formData.get('is_published') === 'on'
  
  const profile_picture_url = formData.get('profile_picture_url') as string
  const banner_image_url = formData.get('banner_image_url') as string
  const company_logo_url = formData.get('company_logo_url') as string
  
  const new_password = formData.get('new_password') as string

  if (!owner_name || !slug) {
    return { error: 'Owner Name and Slug are required' }
  }

  const updateData: any = {
    owner_name,
    slug,
    company_name,
    company_tagline,
    job_title,
    phone_number,
    email,
    website,
    location,
    bio,
    is_published,
    profile_picture_url,
    banner_image_url,
    company_logo_url,
  }

  if (new_password && new_password.trim() !== '') {
    const salt = await bcrypt.genSalt(10)
    updateData.edit_password_hash = await bcrypt.hash(new_password, salt)
  }

  const { error } = await adminClient
    .from('cards')
    .update(updateData)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Slug is already taken. Please choose another.' }
    }
    return { error: error.message }
  }

  // Handle Social Links
  const platforms = formData.getAll('social_platform[]') as string[]
  const urls = formData.getAll('social_url[]') as string[]
  
  await adminClient.from('card_social_links').delete().eq('card_id', id)
  if (platforms.length > 0) {
    const socialLinks = platforms.map((platform, i) => ({
      card_id: id,
      platform,
      url: urls[i],
      order: i
    }))
    await adminClient.from('card_social_links').insert(socialLinks)
  }

  revalidatePath('/admin', 'layout')
  revalidatePath(`/card/${slug}`)
  redirect('/admin?saved=true')
}
