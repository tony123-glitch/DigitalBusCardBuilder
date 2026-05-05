'use server'

import { cookies } from 'next/headers'

export async function adminLoginAction(password: string) {
  const envPassword = process.env.ADMIN_PASSWORD

  if (!envPassword) {
    return { error: 'ADMIN_PASSWORD is not configured in .env.local' }
  }

  if (password === envPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1800, // 30 minutes
    })
    return { success: true }
  }

  return { error: 'Incorrect password' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}
