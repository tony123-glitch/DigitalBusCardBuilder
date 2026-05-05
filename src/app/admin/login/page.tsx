'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLoginAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2 } from 'lucide-react'
import { setAdminAuthenticated } from '@/lib/auth-memory'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await adminLoginAction(password)
      if (res.error) {
        setError(res.error)
      } else {
        // Set the temporary memory flag so AdminGuard knows we legitimately logged in
        setAdminAuthenticated(true)
        router.push('/admin')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-slate-900/20">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">
            Please enter the master password from your environment variables to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-semibold text-center animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••" 
              className="h-14 rounded-2xl text-center text-lg tracking-[0.3em] font-mono bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
              required
              autoFocus
            />
          </div>
          
          <Button type="submit" className="w-full h-14 rounded-2xl text-base font-bold shadow-md shadow-slate-900/10" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Unlock Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  )
}
