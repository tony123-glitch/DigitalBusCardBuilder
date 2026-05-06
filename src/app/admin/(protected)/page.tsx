import { createAdminClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, ExternalLink, KeySquare, CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const adminClient = createAdminClient()

  const { data: cards, error } = await adminClient
    .from('cards')
    .select('id, slug, owner_name, company_name, is_published, created_at')
    .order('created_at', { ascending: false })

  const totalCards = cards?.length || 0
  const publishedCards = cards?.filter(c => c.is_published).length || 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cards</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalCards} total · {publishedCards} live</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Card
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load cards: {error.message}
        </div>
      )}

      {!cards || cards.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No cards yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            Create your first digital business card to get started.
          </p>
          <Link
            href="/admin/cards/new"
            className="mt-5 inline-flex items-center gap-1.5 h-9 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create First Card
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              {/* Card header */}
              <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{card.owner_name}</p>
                  <p className="text-xs text-slate-400 truncate">{card.company_name || 'No company'}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                  card.is_published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${card.is_published ? 'bg-green-500' : 'bg-amber-400'}`} />
                  {card.is_published ? 'Live' : 'Draft'}
                </span>
              </div>

              {/* Slug pill */}
              <div className="px-4 pb-3">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                  /card/{card.slug}
                </span>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 grid grid-cols-3 divide-x divide-slate-100 mt-auto">
                <Link href={`/admin/cards/${card.id}/edit`} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Link>
                <Link href={`/card/${card.slug}`} target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" /> View
                </Link>
                <Link href={`/card/${card.slug}/edit`} target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  <KeySquare className="h-3.5 w-3.5" /> Portal
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
