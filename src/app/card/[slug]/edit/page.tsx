import { createClient, createAdminClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { ImageUploader } from '@/components/ImageUploader'
import { updateCustomerCard } from './actions'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only_please_change_in_prod')

export default async function CustomerEditCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies()
  const token = cookieStore.get(`card_auth_${slug}`)?.value

  if (!token) {
    redirect(`/card/${slug}/edit/login`)
  }

  let cardId = null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    cardId = payload.card_id as string
  } catch (e) {
    redirect(`/card/${slug}/edit/login`)
  }

  const adminClient = createAdminClient()

  // We use the admin client here because the user has provided a valid JWT cookie
  // proving they have access to this specific card, even if it is unpublished.
  const { data: card, error } = await adminClient
    .from('cards')
    .select('*, card_social_links(*)')
    .eq('id', cardId)
    .single()

  if (!card && error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <p>Unable to load card data. The card may be unpublished or restricted.</p>
        </div>
      </div>
    )
  }

  const updateAction = updateCustomerCard.bind(null, slug)

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Card Dashboard</h1>
            <p className="text-sm text-slate-500">Update your public profile information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/card/${slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" /> View Public Card
            </Link>
          </Button>
        </div>
      </div>

      <form action={async (formData) => {
        'use server'
        await updateAction(formData)
      }} className="space-y-6">
      <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal and professional information. Changes are saved immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="owner_name">Your Name <span className="text-red-500">*</span></Label>
                <Input id="owner_name" name="owner_name" defaultValue={card.owner_name} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" name="job_title" defaultValue={card.job_title || ''} placeholder="e.g. Sales Director" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" name="company_name" defaultValue={card.company_name || ''} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company_tagline">Company Tagline</Label>
                <Input id="company_tagline" name="company_tagline" defaultValue={card.company_tagline || ''} placeholder="e.g. We build the future" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={card.email || ''} placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" type="tel" defaultValue={card.phone_number || ''} placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" defaultValue={card.website || ''} placeholder="https://example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={card.location || ''} placeholder="New York, NY" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio / About</Label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={card.bio || ''}
                  rows={4}
                  className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Images</CardTitle>
            <CardDescription>Upload photos to personalize your card.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploader 
              name="profile_picture_url" 
              label="Profile Picture" 
              description="A square headshot or logo. Max 5MB."
              defaultValue={card.profile_picture_url || ''} 
              contextSlug={slug}
              aspectRatio="square"
            />
            
            <div className="pt-4 border-t border-slate-100">
              <ImageUploader 
                name="banner_image_url" 
                label="Banner Image" 
                description="Wide background image for the top of the card."
                defaultValue={card.banner_image_url || ''} 
                contextSlug={slug}
                aspectRatio="video"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <ImageUploader 
                name="company_logo_url" 
                label="Company Logo" 
                description="Small logo displayed next to the company name."
                defaultValue={card.company_logo_url || ''} 
                contextSlug={slug}
                aspectRatio="square"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add links to your social media profiles to display on your public card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialLinksEditor initialLinks={card.card_social_links || []} />
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 border-t border-slate-100 pt-6 rounded-b-xl">
            <Button type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      <div className="text-center text-sm text-slate-500">
        To change your custom URL slug or card password, please contact the administrator.
      </div>
    </div>
  )
}
