'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only_please_change_in_prod')

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  const contextSlug = formData.get('contextSlug') as string

  if (!file) {
    return { error: 'No file provided' }
  }

  // Verify authorization to upload
  let isAuthorized = false

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Admin is logged in
    isAuthorized = true
  } else if (contextSlug) {
    // Check if customer JWT is valid for this slug
    const cookieStore = await cookies()
    const token = cookieStore.get(`card_auth_${contextSlug}`)?.value
    if (token) {
      try {
        await jwtVerify(token, SECRET)
        isAuthorized = true
      } catch (e) {
        // Invalid token
      }
    }
  }

  if (!isAuthorized) {
    return { error: 'Unauthorized to upload images. Session may have expired.' }
  }

  // Upload using Admin Client to bypass RLS since customer JWT auth isn't native Supabase Auth
  const adminClient = createAdminClient()
  
  // Generate safe file name
  const fileExt = file.name.split('.').pop()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileName = `${randomString}_${Date.now()}.${fileExt}`
  
  // We put everything in the root of 'card_media'
  const filePath = `${fileName}`

  const { data, error } = await adminClient.storage
    .from('card_media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Supabase Storage Error:', error)
    return { error: 'Failed to upload image. Please try again.' }
  }

  // Get the public URL
  const { data: { publicUrl } } = adminClient.storage
    .from('card_media')
    .getPublicUrl(filePath)

  return { url: publicUrl }
}
