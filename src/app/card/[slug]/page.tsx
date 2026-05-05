import { createClient, createAdminClient } from '@/utils/supabase/server'
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

  // If not published, only logged-in admin should see it
  if (!card.is_published) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      throw new Error(`Unauthorized. Card is unpublished and no admin session found. Auth error: ${authError?.message}`)
    }
  }

  return <CardClient card={card} />
}
