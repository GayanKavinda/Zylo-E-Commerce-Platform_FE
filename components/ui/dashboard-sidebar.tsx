'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Package } from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()

  const items = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Customers', href: '/dashboard/customer', icon: Users },
    { title: 'Admin Products', href: '/admin', icon: Package },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen p-4">
      <h1 className="text-xl font-bold mb-6">My App</h1>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-md',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
