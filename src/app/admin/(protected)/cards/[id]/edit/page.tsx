import { createClient, createAdminClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, User, Settings, Briefcase, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { ImageUploader } from '@/components/ImageUploader'
import { updateCard } from './actions'

export default async function AdminEditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) {
    throw new Error(`Unauthorized in admin edit page. Auth error: ${authError?.message}`)
  }

  const adminClient = createAdminClient()

  const { data: card, error } = await adminClient
    .from('cards')
    .select('*, card_social_links(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`DB Error in admin edit: ${error.message}`)
  }
  if (!card) {
    throw new Error(`Card not found in admin edit with id: ${id}`)
  }

  const updateCardAction = updateCard.bind(null, id)

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-200" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Card</h1>
            <p className="text-sm text-slate-500 mt-1">Managing profile for {card.owner_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white shadow-sm" asChild>
            <Link href={`/card/${card.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4 text-blue-600" /> View Public Card
            </Link>
          </Button>
        </div>
      </div>

      <form action={async (formData) => {
        'use server'
        await updateCardAction(formData)
      }} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Left Column - Core Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 h-5 w-5 text-blue-500" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="owner_name">Owner Name <span className="text-red-500">*</span></Label>
                    <Input id="owner_name" name="owner_name" defaultValue={card.owner_name} required className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input id="job_title" name="job_title" defaultValue={card.job_title || ''} placeholder="e.g. CEO" className="bg-slate-50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    defaultValue={card.bio || ''}
                    rows={4}
                    className="flex w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="A short bio about the person..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="mr-2 h-5 w-5 text-purple-500" /> Professional Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input id="company_name" name="company_name" defaultValue={card.company_name || ''} placeholder="e.g. Acme Corp" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="company_tagline">Company Tagline</Label>
                    <Input id="company_tagline" name="company_tagline" defaultValue={card.company_tagline || ''} placeholder="e.g. We build the future" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" defaultValue={card.email || ''} placeholder="john@example.com" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" name="phone_number" type="tel" defaultValue={card.phone_number || ''} placeholder="+1 234 567 8900" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" type="url" defaultValue={card.website || ''} placeholder="https://example.com" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={card.location || ''} placeholder="New York, NY" className="bg-slate-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <LinkIcon className="mr-2 h-5 w-5 text-blue-500" /> Social Media Links
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <SocialLinksEditor initialLinks={card.card_social_links || []} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - System & Media */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <Settings className="mr-2 h-5 w-5 text-slate-500" /> System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="slug">Custom URL Slug <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400 font-mono">vici-global.com/card/</span>
                    <Input id="slug" name="slug" defaultValue={card.slug} className="font-mono text-blue-600 bg-slate-50" required />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Label htmlFor="new_password">Reset Customer Password</Label>
                  <Input id="new_password" name="new_password" type="text" placeholder="Leave blank to keep current" className="bg-slate-50 font-mono" />
                  <p className="text-xs text-slate-500">If filled, this will instantly overwrite the password used by the customer to edit their card.</p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      defaultChecked={card.is_published}
                      className="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-600"
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="is_published" className="font-semibold text-slate-900 cursor-pointer">
                        Published
                      </Label>
                      <span className="text-xs text-slate-500">Make this card visible to the public.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <ImageIcon className="mr-2 h-5 w-5 text-teal-500" /> Media & Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <ImageUploader 
                  name="profile_picture_url" 
                  label="Profile Picture" 
                  description="A square headshot or logo. Max 5MB."
                  defaultValue={card.profile_picture_url || ''} 
                  aspectRatio="square"
                />
                
                <div className="pt-4 border-t border-slate-100">
                  <ImageUploader 
                    name="banner_image_url" 
                    label="Banner Image" 
                    description="Wide background image for the top of the card."
                    defaultValue={card.banner_image_url || ''} 
                    aspectRatio="video"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <ImageUploader 
                    name="company_logo_url" 
                    label="Company Logo" 
                    description="Small logo displayed next to the company name."
                    defaultValue={card.company_logo_url || ''} 
                    aspectRatio="square"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button variant="outline" type="button" className="bg-white" asChild>
            <Link href="/admin">Discard Changes</Link>
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-sm px-8">
            Save Card Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
