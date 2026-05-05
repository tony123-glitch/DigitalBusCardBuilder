'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only_please_change_in_prod')

// Helper to get service role client
function getAdminSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}

export async function updateCustomerCard(slug: string, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`card_auth_${slug}`)?.value

  if (!token) {
    return { error: 'Unauthorized' }
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const cardId = payload.card_id as string

    if (!cardId) {
      return { error: 'Invalid token' }
    }

    // Extract allowed fields
    const owner_name = formData.get('owner_name') as string
    const company_name = formData.get('company_name') as string
    const company_tagline = formData.get('company_tagline') as string
    const job_title = formData.get('job_title') as string
    const phone_number = formData.get('phone_number') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string
    const location = formData.get('location') as string
    const bio = formData.get('bio') as string
    const profile_picture_url = formData.get('profile_picture_url') as string
    const banner_image_url = formData.get('banner_image_url') as string
    const company_logo_url = formData.get('company_logo_url') as string
    
    // We explicitly do NOT extract slug, password, or is_published.
    // Customers cannot change those.

    if (!owner_name) {
      return { error: 'Name is required' }
    }

    const supabase = getAdminSupabase()
    
    const { error } = await supabase
      .from('cards')
      .update({
        owner_name,
        company_name,
        company_tagline,
        job_title,
        phone_number,
        email,
        website,
        location,
        bio,
        profile_picture_url,
        banner_image_url,
        company_logo_url,
      })
      .eq('id', cardId)
      .eq('slug', slug) // Extra safety to ensure they are updating the correct slug

    if (error) {
      return { error: error.message }
    }

    // Handle Social Links
    const platforms = formData.getAll('social_platform[]') as string[]
    const urls = formData.getAll('social_url[]') as string[]
    
    await supabase.from('card_social_links').delete().eq('card_id', cardId)
    if (platforms.length > 0) {
      const socialLinks = platforms.map((platform, i) => ({
        card_id: cardId,
        platform,
        url: urls[i],
        order: i
      }))
      await supabase.from('card_social_links').insert(socialLinks)
    }

    revalidatePath(`/card/${slug}`)
    return { success: true }
  } catch (e) {
    return { error: 'Session expired or invalid. Please log in again.' }
  }
}
