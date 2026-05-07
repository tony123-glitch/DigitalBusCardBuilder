import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as jose from 'jose'
import { createAdminClient } from '@/utils/supabase/server'
import CardClient from '../CardClient'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-production'
)

export default async function CustomerEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const cookieStore = await cookies()
  const token = cookieStore.get(`card_edit_${slug}`)?.value

  if (!token) {
    redirect(`/card/${slug}/edit/login`)
  }

  let payload
  try {
    const { payload: decoded } = await jose.jwtVerify(token, JWT_SECRET)
    payload = decoded
  } catch (err) {
    redirect(`/card/${slug}/edit/login`)
  }

  if (payload.slug !== slug) {
    redirect(`/card/${slug}/edit/login`)
  }

  const adminClient = createAdminClient()
  const { data: card, error } = await adminClient
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
          <p className="text-white/60">This card does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <CardClient card={card} isEditable={true} editToken={token} />
  )
}
