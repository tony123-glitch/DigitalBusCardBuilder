import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogOut, CreditCard, LayoutDashboard, Settings, UserCircle } from 'lucide-react'
import { AdminGuard } from '@/components/AdminGuard'
import { logoutAction } from '@/app/admin/login/actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-900 tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span>NFC Connect</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/admin/cards/new" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <CreditCard className="h-4 w-4" />
              New Card
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="bg-slate-100 p-1.5 rounded-full">
              <UserCircle className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-900 truncate">System Admin</span>
              <span className="text-xs text-slate-500 truncate">Authenticated</span>
            </div>
          </div>
          <form action={async () => {
            'use server'
            await logoutAction()
            redirect('/admin/login')
          }}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full px-8 py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      </div>
    </AdminGuard>
  )
}
