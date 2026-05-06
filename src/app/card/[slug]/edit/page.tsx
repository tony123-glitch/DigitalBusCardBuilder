import { createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import Link from 'next/link'
import { ExternalLink, CreditCard, Image as ImageIcon, AtSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { ImageUploader } from '@/components/ImageUploader'
import { updateCustomerCard } from './actions'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only_please_change_in_prod')

export default async function CustomerEditCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(`card_auth_${slug}`)?.value

  if (!token) redirect(`/card/${slug}/edit/login`)

  let cardId = null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    cardId = payload.card_id as string
  } catch (e) {
    redirect(`/card/${slug}/edit/login`)
  }

  const adminClient = createAdminClient()
  const { data: card, error } = await adminClient
    .from('cards')
    .select('*, card_social_links(*)')
    .eq('id', cardId)
    .single()

  if (!card || error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#f8fafc]">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-center text-red-600 text-sm font-medium max-w-sm">
          Unable to load your card. Please try logging in again.
        </div>
      </div>
    )
  }

  const updateAction = updateCustomerCard.bind(null, slug)

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <CreditCard className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">
              {card.owner_name}
            </span>
          </div>
          <Link
            href={`/card/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View Card
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Page title */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Your Card</h1>
        <p className="text-sm text-slate-500 mt-0.5">Changes go live on your public card right away.</p>
      </div>

      <form action={async (formData) => {
        'use server'
        await updateAction(formData)
      }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-4">

          {/* Profile section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <AtSign className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Profile</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="owner_name" className="text-xs font-medium text-slate-600">Your Name <span className="text-red-400">*</span></Label>
                  <Input id="owner_name" name="owner_name" defaultValue={card.owner_name} required className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job_title" className="text-xs font-medium text-slate-600">Job Title</Label>
                  <Input id="job_title" name="job_title" defaultValue={card.job_title || ''} placeholder="e.g. Sales Director" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company_name" className="text-xs font-medium text-slate-600">Company</Label>
                  <Input id="company_name" name="company_name" defaultValue={card.company_name || ''} placeholder="e.g. Acme Corp" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company_tagline" className="text-xs font-medium text-slate-600">Company Tagline</Label>
                  <Input id="company_tagline" name="company_tagline" defaultValue={card.company_tagline || ''} placeholder="e.g. We build the future" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-medium text-slate-600">Bio / About</Label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={card.bio || ''}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 resize-none placeholder:text-slate-400 text-slate-800"
                  placeholder="A short bio about yourself..."
                />
              </div>
            </div>
          </section>

          {/* Contact section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Contact Info</h2>
            </div>
            <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-600">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={card.email || ''} placeholder="you@example.com" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className="text-xs font-medium text-slate-600">Phone</Label>
                <Input id="phone_number" name="phone_number" type="tel" defaultValue={card.phone_number || ''} placeholder="+1 234 567 8900" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs font-medium text-slate-600">Website</Label>
                <Input id="website" name="website" type="url" defaultValue={card.website || ''} placeholder="https://example.com" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-medium text-slate-600">Location</Label>
                <Input id="location" name="location" defaultValue={card.location || ''} placeholder="New York, NY" className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm" />
              </div>
            </div>
          </section>

          {/* Photos section */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <ImageIcon className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Photos</h2>
            </div>
            <div className="px-5 py-5 space-y-5">
              <ImageUploader name="profile_picture_url" label="Profile Picture" description="Square headshot. Max 5MB." defaultValue={card.profile_picture_url || ''} contextSlug={slug} aspectRatio="square" />
              <div className="border-t border-slate-100 pt-5">
                <ImageUploader name="banner_image_url" label="Banner Image" description="Wide cover image for the top of your card." defaultValue={card.banner_image_url || ''} contextSlug={slug} aspectRatio="video" />
              </div>
              <div className="border-t border-slate-100 pt-5">
                <ImageUploader name="company_logo_url" label="Company Logo" description="Logo shown next to your company name." defaultValue={card.company_logo_url || ''} contextSlug={slug} aspectRatio="square" />
              </div>
            </div>
          </section>

          {/* Social links */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Social Links</h2>
              <p className="text-xs text-slate-400 mt-0.5">These appear on your public profile.</p>
            </div>
            <div className="px-5 py-5">
              <SocialLinksEditor initialLinks={card.card_social_links || []} />
            </div>
          </section>

          <p className="text-xs text-center text-slate-400">
            To change your URL or password, contact your administrator.
          </p>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 py-3 z-30">
          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
