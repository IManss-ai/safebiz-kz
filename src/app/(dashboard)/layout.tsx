'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Shield,
  Home,
  Calculator,
  AlertTriangle,
  Calendar,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Главная' },
  { href: '/dashboard/calculator', icon: Calculator, label: 'Калькулятор' },
  { href: '/dashboard/risk-scanner', icon: AlertTriangle, label: 'Риск-сканер' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Календарь' },
]

function Sidebar({
  email,
  onClose,
  onSignOut,
}: {
  email?: string
  onClose?: () => void
  onSignOut: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <Shield className="h-7 w-7 text-blue-600 shrink-0" />
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          SafeBiz KZ
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-md hover:bg-gray-100 lg:hidden"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer: user + sign out */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        {email && (
          <p
            className="truncate text-xs text-gray-400 px-2"
            title={email}
          >
            {email}
          </p>
        )}
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Выйти
        </button>
        <p className="text-xs text-gray-300 px-2">2026 НК РК</p>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [email, setEmail] = useState<string | undefined>(undefined)
  const pathname = usePathname()
  const router = useRouter()

  // Lazy-load email once on first render
  if (typeof window !== 'undefined' && !email) {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user?.email) setEmail(data.user.email)
      })
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const currentPage =
    navItems.find((item) => item.href === pathname)?.label ?? 'Дашборд'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col shrink-0"
        style={{ width: 240 }}
      >
        <Sidebar email={email} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 h-full bg-white z-50 flex flex-col"
            style={{ width: 240 }}
          >
            <Sidebar
              email={email}
              onClose={() => setSidebarOpen(false)}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 bg-white border-b border-gray-200 px-6 py-4 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="flex-1 text-base font-semibold text-gray-800">
            {currentPage}
          </h1>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
            RU
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
