'use server'

import { createAdminClient } from '@/utils/supabase/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only_please_change_in_prod')

export async function customerLogin(slug: string, formData: FormData) {
  const password = formData.get('password') as string

  if (!password) {
    return { error: 'Password is required' }
  }

  const supabase = createAdminClient()

  // Find the card by slug
  const { data: card, error } = await supabase
    .from('cards')
    .select('id, edit_password_hash')
    .eq('slug', slug)
    .single()

  if (error || !card) {
    return { error: 'Invalid card or password' }
  }

  // Compare password
  const isValid = await bcrypt.compare(password, card.edit_password_hash)

  if (!isValid) {
    return { error: 'Invalid password' }
  }

  // Generate a JWT for this card
  const token = await new SignJWT({ card_id: card.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Valid for 24 hours
    .sign(SECRET)

  // Set HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set(`card_auth_${slug}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect(`/card/${slug}/edit`)
}
