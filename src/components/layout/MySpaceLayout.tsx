import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  FolderOpen,
  Trophy,
  BarChart3,
  User,
  Settings,
  Bell,
  Flame,
  BellRing,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MySpaceLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function MySpaceLayout({
  children,
  title,
  description,
}: MySpaceLayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()

  const PRIMARY_NAV = [
    { href: '/myspace/tests', label: t('sidebar.tests'), icon: BookOpen },
    { href: '/myspace/resources', label: t('sidebar.resources'), icon: FolderOpen },
    { href: '/myspace/challenges', label: t('sidebar.challenges'), icon: Trophy },
  ]

  const SECONDARY_NAV = [
    { href: '/myspace/stats', label: t('sidebar.statistics'), icon: BarChart3 },
    { href: '/myspace/streaks', label: t('sidebar.my_streak'), icon: Flame },
    { href: '/myspace/account', label: t('sidebar.my_account'), icon: User },
    { href: '/myspace/options', label: t('sidebar.options'), icon: Settings },
    { href: '/myspace/alerts', label: t('sidebar.alerts'), icon: Bell },
    { href: '/myspace/notifications', label: t('sidebar.notification_settings'), icon: BellRing },
  ]

  const is_active = (href: string) => location.pathname === href

  const NavLink = ({ href, label, icon: Icon }: typeof PRIMARY_NAV[0]) => (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        is_active(href)
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      {/* Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-4">
            {/* Primary Navigation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('sidebar.my_space')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {PRIMARY_NAV.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </CardContent>
            </Card>

            {/* Secondary Navigation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('sidebar.configuration')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {SECONDARY_NAV.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9">
          {children}
        </section>
      </div>
    </div>
  )
}
