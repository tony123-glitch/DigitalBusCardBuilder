'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState<boolean>(false)

  useEffect(() => {
    // Detect if this page load was caused by the user hitting the Refresh (F5) button
    const isReload = 
      (typeof performance !== 'undefined' && performance.navigation && performance.navigation.type === 1) ||
      (typeof performance !== 'undefined' && performance.getEntriesByType('navigation').some(
        (entry) => (entry as PerformanceNavigationTiming).type === 'reload'
      ))

    if (isReload) {
      // Hard refresh detected. Wipe session and redirect
      logoutAction().then(() => {
        router.push('/admin/login')
      })
    } else {
      // Standard navigation, they passed the server layout cookie check, let them in
      setIsAllowed(true)
    }
  }, [router])

  // Don't render children until we verify it's not a refresh
  if (!isAllowed) {
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
