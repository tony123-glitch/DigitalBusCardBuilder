import Link from 'next/link'
import { CreditCard, LayoutDashboard, PlusCircle, Menu } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Top nav — used on both mobile and desktop */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <CreditCard className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 hidden sm:block">NFC Connect</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1 ml-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/admin/cards/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Card</span>
            </Link>
          </nav>

          {/* Right slot — spacer */}
          <div className="ml-auto" />
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
