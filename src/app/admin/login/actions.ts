'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLoginAction(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
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
      // Removed maxAge to make it a standard session cookie (clears on browser close)
    })
  } else {
    return { error: 'Incorrect password' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}
