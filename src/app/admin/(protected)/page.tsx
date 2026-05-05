import { createClient, createAdminClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, ExternalLink, KeySquare, TrendingUp, Users, CreditCard as CreditCardIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const adminClient = createAdminClient()

  // Fetch all cards
  const { data: cards, error } = await adminClient
    .from('cards')
    .select('id, slug, owner_name, company_name, is_published, created_at')
    .order('created_at', { ascending: false })

  const totalCards = cards?.length || 0
  const publishedCards = cards?.filter(c => c.is_published).length || 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your digital business cards and NFC links.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/cards/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Card
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Cards</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalCards}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Published</p>
              <h3 className="text-2xl font-bold text-slate-900">{publishedCards}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Drafts</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalCards - publishedCards}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load cards: {error.message}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Cards</h2>
        
        {!cards || cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No cards created</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              You haven't created any digital business cards yet. Get started by creating your first one.
            </p>
            <div className="mt-6">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/cards/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Card
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card key={card.id} className="flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-4">
                      <CardTitle className="line-clamp-1">{card.owner_name}</CardTitle>
                      <CardDescription className="line-clamp-1">{card.company_name || 'No company'}</CardDescription>
                    </div>
                    <div className="shrink-0 flex h-6 items-center rounded-full bg-slate-50 px-2.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/50">
                      {card.is_published ? (
                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-green-500" />Live</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-400" />Draft</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4 bg-white">
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 font-mono border border-slate-100 flex items-center justify-between group">
                    <span className="truncate">/{card.slug}</span>
                    <span className="text-[10px] uppercase tracking-wider font-sans text-slate-400 font-bold">Slug</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 pt-4 px-4 pb-4">
                  <div className="flex w-full items-center gap-2">
                    <Button variant="secondary" className="flex-1 bg-white hover:bg-slate-50 shadow-sm border border-slate-200" asChild>
                      <Link href={`/admin/cards/${card.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4 text-blue-600" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 bg-white shadow-sm border-slate-200" asChild>
                      <Link href={`/card/${card.slug}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4 text-slate-500" /> View
                      </Link>
                    </Button>
                  </div>
                  <div className="w-full">
                    <Button variant="ghost" className="w-full text-slate-500 text-xs h-8" asChild>
                      <Link href={`/card/${card.slug}/edit`} target="_blank">
                        <KeySquare className="mr-2 h-3 w-3" /> Customer Portal
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
