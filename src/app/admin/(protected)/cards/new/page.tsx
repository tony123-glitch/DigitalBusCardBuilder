'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createCard } from './actions'
import Link from 'next/link'
import { ArrowLeft, Wand2, User, Building2, KeyRound, Globe } from 'lucide-react'

export default function NewCardPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form states for auto-generation
  const [ownerName, setOwnerName] = useState('')
  const [slug, setSlug] = useState('')
  const [password, setPassword] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setOwnerName(val)
    if (!slug || slug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let pwd = ''
    for (let i = 0; i < 12; i++) {
      pwd += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(pwd)
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createCard(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-200" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Card</h1>
          <p className="text-slate-500 mt-1">Generate a secure digital identity link for a customer.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-center shadow-sm">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <KeyRound className="h-4 w-4 text-red-600" />
            </div>
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 h-5 w-5 text-blue-500" /> Owner Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="owner_name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="owner_name"
                    name="owner_name"
                    value={ownerName}
                    onChange={handleNameChange}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    placeholder="e.g. Acme Corp"
                    className="bg-slate-50/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-blue-50/30">
              <CardHeader className="border-b border-blue-100 bg-blue-50/50">
                <CardTitle className="flex items-center text-lg text-blue-900">
                  <Building2 className="mr-2 h-5 w-5 text-blue-600" /> Card Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="theme_color">Primary Theme Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="theme_color"
                      name="theme_color"
                      type="color"
                      defaultValue="#0F172A"
                      className="w-16 h-10 p-1 cursor-pointer bg-white"
                    />
                    <Input
                      type="text"
                      defaultValue="#0F172A"
                      className="flex-1 font-mono text-slate-500 bg-white"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <Globe className="mr-2 h-5 w-5 text-purple-500" /> Public Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="slug">Custom URL Slug <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="text-sm font-mono text-slate-400 hidden sm:inline-block bg-slate-100 px-3 py-2 rounded-l-md border border-r-0 border-slate-200">/card/</span>
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="sarah-jenkins"
                      className="flex-1 rounded-l-none font-mono text-blue-600 focus-visible:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">This is the exact URL that will be programmed onto the NFC bracelet.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center text-lg">
                  <KeyRound className="mr-2 h-5 w-5 text-amber-500" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit_password">Customer Edit Password <span className="text-red-500">*</span></Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="edit_password"
                      name="edit_password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. StrongPass123!"
                      className="font-mono bg-slate-50 focus-visible:ring-amber-500"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generatePassword} className="shrink-0 bg-white">
                      <Wand2 className="mr-2 h-4 w-4 text-amber-600" /> Generate
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Provide this password to the customer. They will need it to log in and edit their card details securely.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" className="bg-white" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-sm" disabled={isPending}>
            {isPending ? 'Creating Card...' : 'Create & Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}
