import { createAdminClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, User, Briefcase, Link as LinkIcon, Image as ImageIcon, Settings, KeyRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { ImageUploader } from '@/components/ImageUploader'
import { updateCard } from './actions'

export default async function AdminEditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const adminClient = createAdminClient()

  const { data: card, error } = await adminClient
    .from('cards')
    .select('*, card_social_links(*)')
    .eq('id', id)
    .single()

  if (error || !card) {
    notFound()
  }

  const updateCardAction = updateCard.bind(null, id)

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="h-8 w-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">Editing — {card.owner_name}</h1>
          <p className="text-xs text-slate-400 font-mono">/card/{card.slug}</p>
        </div>
        <Link
          href={`/card/${card.slug}`}
          target="_blank"
          className="ml-auto inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View
        </Link>
      </div>

      <form action={async (formData) => {
        'use server'
        await updateCardAction(formData)
      }}>
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Left — main info (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Personal</h2>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="owner_name" className="text-xs text-slate-600 font-medium">Full Name <span className="text-red-400">*</span></Label>
                  <Input id="owner_name" name="owner_name" defaultValue={card.owner_name} required className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job_title" className="text-xs text-slate-600 font-medium">Job Title</Label>
                  <Input id="job_title" name="job_title" defaultValue={card.job_title || ''} placeholder="e.g. CEO" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="col-span-full space-y-1.5">
                  <Label htmlFor="bio" className="text-xs text-slate-600 font-medium">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    defaultValue={card.bio || ''}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none placeholder:text-slate-400"
                    placeholder="Short bio..."
                  />
                </div>
              </div>
            </section>

            {/* Professional */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Company & Contact</h2>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company_name" className="text-xs text-slate-600 font-medium">Company</Label>
                  <Input id="company_name" name="company_name" defaultValue={card.company_name || ''} placeholder="Acme Corp" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company_tagline" className="text-xs text-slate-600 font-medium">Tagline</Label>
                  <Input id="company_tagline" name="company_tagline" defaultValue={card.company_tagline || ''} placeholder="We build the future" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-600 font-medium">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={card.email || ''} placeholder="john@example.com" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number" className="text-xs text-slate-600 font-medium">Phone</Label>
                  <Input id="phone_number" name="phone_number" type="tel" defaultValue={card.phone_number || ''} placeholder="+1 234 567 8900" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs text-slate-600 font-medium">Website</Label>
                  <Input id="website" name="website" type="url" defaultValue={card.website || ''} placeholder="https://example.com" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs text-slate-600 font-medium">Location</Label>
                  <Input id="location" name="location" defaultValue={card.location || ''} placeholder="New York, NY" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Social Links</h2>
              </div>
              <div className="px-5 py-4">
                <SocialLinksEditor initialLinks={card.card_social_links || []} />
              </div>
            </section>
          </div>

          {/* Right — system + media */}
          <div className="space-y-5">

            {/* System settings */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Settings</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="slug" className="text-xs text-slate-600 font-medium">URL Slug <span className="text-red-400">*</span></Label>
                  <div className="flex items-center gap-0">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 border border-r-0 border-slate-200 px-2.5 py-2.5 rounded-l-xl whitespace-nowrap">/card/</span>
                    <Input id="slug" name="slug" defaultValue={card.slug} required className="h-10 rounded-l-none rounded-r-xl bg-slate-50/50 border-slate-200 text-sm font-mono text-blue-600 flex-1" />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    defaultChecked={card.is_published}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <div>
                    <Label htmlFor="is_published" className="text-sm font-semibold text-slate-800 cursor-pointer">Published</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Visible to the public</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <Label htmlFor="new_password" className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" /> Reset Customer Password
                  </Label>
                  <Input id="new_password" name="new_password" type="text" placeholder="Leave blank to keep current" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-mono" />
                  <p className="text-[11px] text-slate-400">If filled, overwrites the customer's login password.</p>
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Images</h2>
              </div>
              <div className="px-5 py-4 space-y-5">
                <ImageUploader name="profile_picture_url" label="Profile Picture" description="Square. Max 5MB." defaultValue={card.profile_picture_url || ''} aspectRatio="square" />
                <div className="border-t border-slate-100 pt-4">
                  <ImageUploader name="banner_image_url" label="Banner Image" description="Wide cover photo." defaultValue={card.banner_image_url || ''} aspectRatio="video" />
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <ImageUploader name="company_logo_url" label="Company Logo" description="Small, shown next to company name." defaultValue={card.company_logo_url || ''} aspectRatio="square" />
                </div>
              </div>
            </section>

            {/* Save */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
