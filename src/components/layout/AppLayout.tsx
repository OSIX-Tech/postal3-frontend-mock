import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface AppLayoutProps {
  children: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  } | null
  notifications_count?: number
  streak_days?: number
  cart_items?: number
  on_logout?: () => void
  hide_footer?: boolean
}

export function AppLayout({
  children,
  user,
  notifications_count = 0,
  streak_days = 0,
  cart_items = 0,
  on_logout,
  hide_footer = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={user}
        notifications_count={notifications_count}
        streak_days={streak_days}
        cart_items={cart_items}
        on_logout={on_logout}
      />

      {/* Main content with padding for floating navbar */}
      <main className="flex-1 pt-24">
        {children}
      </main>

      {!hide_footer && <Footer />}
    </div>
  )
}
