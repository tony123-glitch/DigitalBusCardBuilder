'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'
import { isAdminAuthenticated } from '@/lib/auth-memory'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAdminAuthenticated) {
      // Memory was wiped (e.g. by a refresh) or user navigated here directly without logging in
      logoutAction().then(() => {
        router.push('/admin/login')
      })
    }
  }, [router])

  // Don't render children if they aren't authenticated in memory
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        {/* Simple skeleton loader to prevent flash before redirect */}
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-slate-200 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
