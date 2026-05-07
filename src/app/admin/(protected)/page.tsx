import { createAdminClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, ExternalLink, KeySquare, CreditCard, Archive, Trash2, ArchiveRestore, AlertCircle } from 'lucide-react'
import { archiveCard, deleteCard, deleteAllArchivedCards } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ saved?: string, tab?: string }> }) {
  const { saved, tab } = await searchParams
  const adminClient = createAdminClient()

  const { data: cards, error } = await adminClient
    .from('cards')
    .select('id, slug, owner_name, company_name, is_published, created_at, is_archived')
    .order('created_at', { ascending: false })

  const activeCards = cards?.filter(c => !c.is_archived) || []
  const archivedCards = cards?.filter(c => c.is_archived) || []
  
  const isArchivedView = tab === 'archived'
  const displayCards = isArchivedView ? archivedCards : activeCards

  const publishedCards = activeCards.filter(c => c.is_published).length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cards</h1>
          <p className="text-sm text-slate-500 mt-0.5">{activeCards.length} active · {publishedCards} live</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Card
        </Link>
      </div>

      {saved === 'true' && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium shadow-sm flex items-center justify-between">
          <span>Card saved successfully.</span>
          <Link href="/admin" className="text-green-600 hover:text-green-800">Dismiss</Link>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load cards: {error.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-6">
          <Link 
            href="/admin" 
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${!isArchivedView ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Active Cards
          </Link>
          <Link 
            href="/admin?tab=archived" 
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${isArchivedView ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'} flex items-center gap-1.5`}
          >
            Archived
            {archivedCards.length > 0 && (
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px]">{archivedCards.length}</span>
            )}
          </Link>
        </div>
        {isArchivedView && archivedCards.length > 0 && (
          <form action={deleteAllArchivedCards} className="pb-3">
             <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
               <AlertCircle className="w-3.5 h-3.5" /> Delete All
             </button>
          </form>
        )}
      </div>

      {!displayCards || displayCards.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {isArchivedView ? <Archive className="h-5 w-5 text-slate-400" /> : <CreditCard className="h-5 w-5 text-slate-400" />}
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {isArchivedView ? 'No archived cards' : 'No active cards'}
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs">
            {isArchivedView ? 'Archived cards will appear here.' : 'Create your first digital business card to get started.'}
          </p>
          {!isArchivedView && (
            <Link
              href="/admin/cards/new"
              className="mt-5 inline-flex items-center gap-1.5 h-9 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create First Card
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayCards.map((card) => (
            <div key={card.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col ${isArchivedView ? 'opacity-70' : ''}`}>
              {/* Card header */}
              <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{card.owner_name}</p>
                  <p className="text-xs text-slate-400 truncate">{card.company_name || 'No company'}</p>
                </div>
                {!isArchivedView && (
                  <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                    card.is_published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${card.is_published ? 'bg-green-500' : 'bg-amber-400'}`} />
                    {card.is_published ? 'Live' : 'Draft'}
                  </span>
                )}
              </div>

              {/* Slug pill */}
              <div className="px-4 pb-3">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                  /card/{card.slug}
                </span>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 grid grid-flow-col divide-x divide-slate-100 mt-auto">
                {!isArchivedView ? (
                  <>
                    <Link href={`/admin/cards/${card.id}/edit`} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <Link href={`/card/${card.slug}`} target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> View
                    </Link>
                    <form action={archiveCard.bind(null, card.id, true)} className="flex">
                      <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                        <Archive className="h-3.5 w-3.5" /> Archive
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <form action={archiveCard.bind(null, card.id, false)} className="flex">
                      <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors w-full px-4">
                        <ArchiveRestore className="h-3.5 w-3.5" /> Restore
                      </button>
                    </form>
                    <form action={deleteCard.bind(null, card.id)} className="flex">
                      <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full px-4">
                        <Trash2 className="h-3.5 w-3.5" /> Delete Forever
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
