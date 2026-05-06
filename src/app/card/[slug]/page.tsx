import { createAdminClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import CardClient from './CardClient'

export default async function PublicCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const adminClient = createAdminClient()

  // Fetch card data bypassing RLS so we can check if it exists but is unpublished
  const { data: card, error } = await adminClient
    .from('cards')
    .select(`
      *,
      card_social_links(platform, url),
      card_custom_buttons(label, url)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    throw new Error(`Database error fetching card: ${error.message}`)
  }
  if (!card) {
    throw new Error(`Card not found with slug: ${slug}`)
  }

  // If not published, return not found rather than exposing an error
  if (!card.is_published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 font-sans">
        <div className="text-center max-w-xs">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-base font-semibold text-slate-900">Card Not Available</h1>
          <p className="text-sm text-slate-500 mt-1">This card is not yet published.</p>
        </div>
      </div>
    )
  }

  return <CardClient card={card} />
}
