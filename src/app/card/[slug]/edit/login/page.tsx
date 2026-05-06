'use client'

import { useState, useTransition, use } from 'react'
import { Input } from '@/components/ui/input'
import { customerLogin } from './actions'
import Link from 'next/link'
import { ArrowLeft, Lock, Loader2 } from 'lucide-react'

export default function CustomerLoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await customerLogin(slug, formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-sm">
        {/* Back link */}
        <Link
          href={`/card/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to card
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-8 pb-6 text-center border-b border-slate-100">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Your Card</h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter the password your admin gave you to update your info.
            </p>
          </div>

          {/* Form */}
          <form action={handleSubmit} className="px-7 py-6 space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                autoFocus
                className="h-12 rounded-xl text-base bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
              ) : (
                'Access My Card'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
