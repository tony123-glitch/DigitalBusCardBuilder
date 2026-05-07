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

  // Generate a JWT for this card — include slug so the edit page can verify it
  const token = await new SignJWT({ card_id: card.id, slug })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Valid for 30 days so mobile users don't get kicked out
    .sign(SECRET)

  // Set HTTP-only cookie — must match the name the edit page reads: card_edit_{slug}
  const cookieStore = await cookies()
  cookieStore.set(`card_edit_${slug}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  redirect(`/card/${slug}/edit`)
}
