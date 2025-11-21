'use client'

import useAuthStore from '@/lib/authStore'
import { useRouter } from 'next/navigation'

export default function Topbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
      <span className="font-medium text-lg">
        {user ? `${user.name} (${user.role})` : 'Loading'}
      </span>

      {user && (
        <button
          onClick={() => logout()}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Logout
        </button>
      )}
    </header>
  )
}
