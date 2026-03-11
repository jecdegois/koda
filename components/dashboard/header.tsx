'use client'

import { useProfile } from '@/lib/hooks/useProfile'

export function DashboardHeader() {
  const { profile } = useProfile()

  const greeting = getGreeting()

  return (
    <header className="bg-background border-b border-border p-6 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          {greeting}, {profile?.full_name || 'Usuario'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenido a tu dashboard financiero
        </p>
      </div>
    </header>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

