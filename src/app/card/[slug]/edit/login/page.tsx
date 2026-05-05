'use client'

import { useState, useTransition, use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { customerLogin } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href={`/card/${slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Card
          </Link>
        </Button>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Edit Your Card</CardTitle>
            <CardDescription>
              Enter the password provided by your administrator to update your information.
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? 'Verifying...' : 'Access Editor'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
